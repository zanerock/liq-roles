import { rolesPluginDir } from './roles-plugin-dir'

const hostVersionRetriever = ({ app }) =>
  app.liq.handlerPlugins.find(({ npmName }) => npmName === '@liquid-labs/liq-roles')?.version

const installedPluginsRetriever = ({ model, req }) => {
  const { orgKey } = req.vars
  console.log('model.orgs[orgKey].rolePlugins:', model.orgs[orgKey].rolePlugins)
  return model.orgs[orgKey].rolePlugins
}

const pluginPkgDirRetriever = ({ model, req }) => {
  const { orgKey } = req.vars
  const org = model.orgs[orgKey]
  const rolesRepo = org.requireSetting('org.STAFF_REPO')
  const [orgBit, projectBit] = rolesRepo.split('/')

  return rolesPluginDir({ orgBit, projectBit })
}

export { hostVersionRetriever, installedPluginsRetriever, pluginPkgDirRetriever }
