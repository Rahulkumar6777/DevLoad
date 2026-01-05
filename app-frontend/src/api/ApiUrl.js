const NodeEnv = 'productions'

const localhostURl = 'http://localhost:6700/api/v2/user'

const DeploymentUrl = 'https://api-devload.cloudcoderhub.in/api/v2/user'

export const BaseUrl = NodeEnv === 'production' ? DeploymentUrl : localhostURl