import { check } from 'k6'
import http from 'k6/http'
import env from '../services/api/routes'

const url = env.BASES_URL.BASE_URL_BANK_API
const users = env.BASE_USERS.USERNAME_USER
const password = env.BASE_PASSWORDS.PASSWORD
const client = env.CLIENTS.CLIENT_ID

export default class Login {
	constructor() {
		this.params = {
			headers: {
				// 'accept': 'application/json',
				'Content-Type': 'application/json',
				monitor: false,
				'x-token':
					'892w3387e159ftgbce7a01fbbe586985521010723b85d56bf791E64a35b9e958',
			},
		}
		this.token = ''
	}

	access() {
		let payload = JSON.stringify({
			username: users,
			password: password,
			client_id: client,
		})

		let response = http.post(url, payload, this.params)
		this.token = response.json('authorization')
		check(response, {
			'is status 200': () => response.status === 200,
		})
	}

	getToken() {
		return this.token
	}
}
