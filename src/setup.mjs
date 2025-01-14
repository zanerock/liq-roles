import { loadRolePlugins } from './handlers/orgs/roles/plugins/_lib/load-role-plugins'
import { loadRoles } from './resources/load-roles'

const reportPath = 'security/reports/PCI\\ DSS\\ Roles\\ and\\ Access\\ Report.md'

const setup = async({ app, model, reporter }) => {
  setupPathResolvers({ app, model })

  app.liq.orgSetupMethods.push({
    name : 'load roles plugins',
    func : loadRolePlugins
  })

  app.liq.orgSetupMethods.push({
    name : 'load roles',
    deps : ['load roles plugins'],
    func : loadRoles
  })

  for (const [orgKey, org] of Object.entries(model.orgs)) {
    if (!org.policies) {
      org.policies = {}
    }
    if (!org.policies._make) {
      org.policies._make = []
    }

    const buildTargets = [
      '$(OUT_DIR)/' + reportPath
    ]

    const { policyRepoPath } = org

    org.policies._make.push({
      buildTargets,
      rulesDecls : () => `${buildTargets[0]}:
\tmkdir -p $(dir $@)
\tliq2 orgs ${orgKey} roles accesses chd-access > "$@"
\tcat ${policyRepoPath}/src/assets/${reportPath.slice(0, -3)}.append.md >> "$@"
`
    })
  }
}

const setupPathResolvers = ({ app, model }) => {
  app.liq.pathResolvers.roleName = {
    optionsFetcher : ({ currToken = '', orgKey }) => {
      const org = model.orgs[orgKey]
      return org.roles.list({ rawData : true }).map((r) => r.name) || []
    },
    bitReString : '[a-zA-Z_ -]+'
  }

  app.liq.pathResolvers.rolePluginName = {
    bitReString    : '[a-z][a-z0-9-]*',
    optionsFetcher : ({ model, orgKey }) => {
      const org = model.orgs[orgKey]
      const plugins = org.rolePlugins || []

      return plugins.map(({ name }) => name)
    }
  }
}

export { setup }
