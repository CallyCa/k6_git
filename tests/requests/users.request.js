import { check } from 'k6'
import http from 'k6/http'
import Router from '../services/index'

export default class Users {
	constructor() {
		this.params = {
			headers: {
				'Content-Type': 'application/json',
				monitor: false,
			},
		}
	}

	list() {
		let response = http.get(`${Router.getBaseUrl()}/usuarios`, this.params)
		check(response, {
			'is status 200': () => response.status == 200,
		})
	}
}
