import { init as initApm } from '@elastic/apm-rum'


export default ( { $axios, app } ) => {
  const apm = initApm( {

    // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
    serviceName: 'front-app-rum',

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://localhost:8200',

    // Set service version (required for sourcemap feature)
    serviceVersion: '',
    logLevel: 'trace',
    pageLoadTransactionName: app.context.route.path
  } )

  app.router.beforeEach( ( to, from, next ) => {
    app.context.apmCurrentTransaction = apm.startTransaction( to.path, 'route-change' )
    app.context.apmCurrentSpan = app.context.apmCurrentTransaction.startSpan( 'Page building' )
    next()
  } )

  app.router.afterEach( ( to, from ) => {
    app.context.apmCurrentSpan.end()
    app.context.apmCurrentTransaction.end()
  } )

  $axios.interceptors.request.use( function( config ) {
    app.context.apmCurrentTransaction.startSpan( 'XHR' )
    return config
  } )

  $axios.interceptors.response.use( function( response ) {
    console.log( 'XHR END' )
    return response
  } )
}
