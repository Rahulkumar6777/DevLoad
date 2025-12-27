const NodeEnv = 'production'

const localhostURl = 'http://localhost:5175'

const DeploymentUrl = 'https://app-devload.cloudcoderhub.in'


export const privateAppDomain = NodeEnv === 'production' ? DeploymentUrl : localhostURl;