import path from 'path'

const apmBase = require( 'elastic-apm-node' )

export default function( moduleOptions ) {
  const apm = apmBase.start( {
    serviceName: 'front-app',

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'http://localhost:8200',

    // Set service version (required for sourcemap feature)
    serviceVersion: '',
    logLevel: 'trace'
  } )

  this.nuxt.hook( 'render:route', ( url, result, context ) => {
    context.apmCurrentTransaction = apm.startTransaction( url )
  } )

  this.nuxt.hook( 'render:routeDone', ( url, result, context ) => {
    context.apmCurrentTransaction.end()
  } )

  this.addPlugin( {
    src: path.resolve( __dirname, 'plugins/elk-apm.client.js' ),
    mode: 'client'
  } )

  this.addPlugin( {
    src: path.resolve( __dirname, 'plugins/elk-apm.server.js' ),
    mode: 'server',
    options: {
      apmAgent: apm
    }
  } )
}
