import { AwsRum } from 'aws-rum-web'

let awsRumInstance = null

export const initRUM = () => {
  // Only initialize in production
  if (!import.meta.env.PROD) {
    console.log('CloudWatch RUM: Skipping initialization in development')
    return
  }

  // Check if already initialized
  if (awsRumInstance) {
    console.log('CloudWatch RUM: Already initialized')
    return
  }

  // Verify required environment variables
  const appId = import.meta.env.VITE_AWS_RUM_APP_UUID
  const identityPoolId = import.meta.env.VITE_AWS_RUM_IDENTITY_POOL_ID
  const region = import.meta.env.VITE_AWS_REGION || 'eu-west-2'

  if (!appId || !identityPoolId) {
    console.warn('CloudWatch RUM: Missing required environment variables')
    return
  }

  try {
    const config = {
      sessionSampleRate: 1, // 100% of sessions
      identityPoolId: identityPoolId,
      endpoint: `https://dataplane.rum.${region}.amazonaws.com`,
      telemetries: ['errors', 'performance', 'http'],
      allowCookies: true,
      enableXRay: false,
      signing: true,
    }

    const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'

    awsRumInstance = new AwsRum(appId, appVersion, region, config)

    console.log('CloudWatch RUM: Initialized successfully', {
      appId,
      version: appVersion,
      region,
    })
  } catch (error) {
    console.error('CloudWatch RUM: Failed to initialize', error)
  }
}

export const getRUMInstance = () => awsRumInstance
