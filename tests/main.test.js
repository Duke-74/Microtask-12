import request from 'supertest'
import app from '../index'

describe('Test', () => {
  test('GET /post', (done) => {
    request(app)
      .get('/post')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        return done()
      })
  })
  // More things come here
})
