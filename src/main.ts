import * as fs from 'fs'
import * as ps from 'child_process'
import * as core from '@actions/core'

export async function main() {
  const docker_compose_path = core.getInput('docker-compose-path')
  const docker_compose_profile = core.getInput('docker-compose-profile')

  const command = `docker-compose --file ${docker_compose_path} --profile ${docker_compose_profile} up --detach`
  const options = { cwd: process.env.GITHUB_WORKSPACE }

  if (fs.existsSync(docker_compose_path)) {
    core.info(`Running ${command} ...`)
    // execute the command
    ps.execSync(command, options)
  }
}

export async function post() {
  const docker_compose_path = core.getInput('docker-compose-path')
  const docker_compose_profile = core.getInput('docker-compose-profile')

  const commands = [
    `docker-compose --file ${docker_compose_path} --profile ${docker_compose_profile} logs`,
    `docker-compose --file ${docker_compose_path} --profile ${docker_compose_profile} down`
  ]

  const options = { cwd: process.env.GITHUB_WORKSPACE }

  if (fs.existsSync(docker_compose_path)) {
    commands.forEach(command => {
      core.info(`Running ${command} ...`)
      // execute the command
      const result = ps.execSync(command, options)
      // log the result
      core.info(result.toString())
    })
  }
}
