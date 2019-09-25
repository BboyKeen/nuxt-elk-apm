const consola = require( 'consola' )

export default ( { $axios, app, router }, inject ) => {
  const spans = []

  $axios.interceptors.request.use( function( config ) {
    if (!app.context.apmCurrentTransaction) {
      /* Start tracing transaction if Axios is called before 
         route rendering like in nuxtServerInit
      */
    }
    const span = app.context.apmCurrentTransaction.startSpan( 'XHR' )

    const spanTraceId = span.traceId
    spans[spanTraceId] = span
    
    config.traceId = spanTraceId
    return config
  } )

  $axios.interceptors.response.use( function( response ) {
    console.log( 'XHR END' )
    return response
  } )
}
