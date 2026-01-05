const NodeEnv = 'production'

const localhostURl = 'http://localhost:5173'

const DeploymentUrl = 'https://devload.cloudcoderhub.in'


export const privateAppDomain = NodeEnv === 'production' ? DeploymentUrl : localhostURl;