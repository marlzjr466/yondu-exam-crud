const {describe, expect, test} = require('@jest/globals')
const { db, app, query, bcrypt } = require('../app')

describe('All Test Suites', () => {
    test('GET /user', async () => {
        await app.get('/user', async () => {
            await query.get(db, response => {
                expect(response).toBeDefined()
            })
        })
    })

    test('POST /user', async () => {
        await app.post('/user', async res => {
            let data = {
                "firstname": "Dan",
                "lastname": "Padayao",
                "address": "Pagadian",
                "postcode": "7895",
                "contact": "09123456789",
                "email": "dan@gmail.com",
                "username": "dan123",
                "password": "danpassword"
            }

            try {
                const hashedPassword = await bcrypt.hash(data.password, 10)
                data.password = hashedPassword

                query.add(db, {
                    user: data
                }, response => {
                    expect(response).toBe('New user registered')
                })
            } catch (e) {
                expect(res).toBe('Error has occur')
            }
        })
    })

    test('PUT /user/:id', async () => {
        await app.put('/user/:id', async () => {
            let data = {
                "firstname": "Mario",
                "lastname": "Langomez Jr",
                "address": "Cebu",
                "postcode": "6000",
                "contact": "09162364559",
                "email": "marlzjrjr@gmail.com",
                "username": "marlzjr466",
                "password": "pass123"
            }

            try {
                const hashedPassword = await bcrypt.hash(data.password, 10)
                data.password = hashedPassword
        
                query.update(db, {
                    id: req.params.id,
                    user: data
                }, response => {
                    expect(response).toBe('User info updated')
                })
            } catch(e) {
                expect(response).toBe('Error has occur')
            }
        })
    })

    test('DELETE /user/:id', async () => {
        await app.delete('/user/:id', () => {
            var ids = req.params.id.split(',')
            query.delete(db, {
                userIDs: ids
            }, function(response) {
                expect(response).toBe('Selected users deleted successfully')
            })
            
        })
    })

    test('POST /user/login', async () => {
        await app.post('/user/login', res => {
            let data = {
                "username": "marlzjr466",
                "password": "pass123"
            }

            query.get(db, async response => {
                const user = response.find(user => user.username = data.username)
                if (user == null || user == undefined) {
                    expect(res).toBe('Cannot find user')
                }
        
                try {
                    if (await bcrypt.compare(data.password, user.password)) {
                        query.updateStatus(db, {
                            id: user.id
                        }, statusResponse => {
                            expect(res).toBe(statusResponse)
                        })
                    } else {
                        expect(response).toBe('Incorrect password')
                    }
                } catch(e) {
                    expect(res).toBe(500)
                }
            })
        })
    })
})
