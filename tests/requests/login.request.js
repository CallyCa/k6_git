import { check } from 'k6'
import http from 'k6/http'
import env from '../services/api/routes'

const url = env.URL_TEST.SERVREST
const email = env.BASE_USERS.EMAIL_USER
const password = env.BASE_PASSWORDS.PASSWORD

export default class Login {
	constructor() {
		this.params = {
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				monitor: false,
			},
		}
		this.token = ''
	}

	access() {
		let payload = JSON.stringify({
			email: email,
			password: password,
		})

		let response = http.post(`${url}/login`, payload, this.params)
		this.token = response.json('authorization')
		check(response, {
			'is status 200': () => response.status === 200,
		})
	}

	getToken() {
		return this.token
	}
}
