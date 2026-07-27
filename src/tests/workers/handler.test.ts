// @vitest-environment node

import { describe, expect, test } from 'vitest'

import { handleWorkerRequest, type WorkerEnv } from '../../../workers/handler'

const HOME_BODY = '<html>home</html>'
const NOT_FOUND_BODY = '<html>not found</html>'
const NOT_FOUND_BODY_EN = '<html>not found (en)</html>'

// `not_found_handling: "none"` の ASSETS バインディング相当。
// 実在するファイルは 200、それ以外は素の 404 を返す。
const createEnv = (overrides: Partial<WorkerEnv> = {}): WorkerEnv => {
  return {
    ASSETS: {
      fetch: (request) => {
        const { pathname } = new URL(request.url)

        if (pathname === '/') {
          return new Response(HOME_BODY, { status: 200 })
        }

        if (pathname === '/en/') {
          return new Response(HOME_BODY, { status: 200 })
        }

        if (pathname === '/404.html') {
          return new Response(NOT_FOUND_BODY, { status: 200 })
        }

        if (pathname === '/en/404.html') {
          return new Response(NOT_FOUND_BODY_EN, { status: 200 })
        }

        return new Response('Not Found', { status: 404 })
      },
    },
    ...overrides,
  }
}

const basicAuthHeader = (user: string, pass: string) => {
  return `Basic ${btoa(`${user}:${pass}`)}`
}

describe('handleWorkerRequest', () => {
  test('実在するアセットを配信する', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/'),
      createEnv(),
    )

    expect(response.status).toBe(200)
    await expect(response.text()).resolves.toBe(HOME_BODY)
  })

  test('存在しないパスではビルド済み404ページを404ステータスで返す', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/missing'),
      createEnv(),
    )

    expect(response.status).toBe(404)
    await expect(response.text()).resolves.toBe(NOT_FOUND_BODY)
  })

  test('/en 配下の存在しないパスでは英語の404ページを返す', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/en/missing'),
      createEnv(),
    )

    expect(response.status).toBe(404)
    await expect(response.text()).resolves.toBe(NOT_FOUND_BODY_EN)
  })

  test('/en 自体（末尾スラッシュ無し）も英語の404に向ける', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/en'),
      createEnv(),
    )

    expect(response.status).toBe(404)
    await expect(response.text()).resolves.toBe(NOT_FOUND_BODY_EN)
  })

  test('/entrance のように en で始まるだけのパスは日本語の404を返す', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/entrance'),
      createEnv(),
    )

    expect(response.status).toBe(404)
    await expect(response.text()).resolves.toBe(NOT_FOUND_BODY)
  })

  test('認証情報が未設定なら認証をスキップする', async () => {
    const response = await handleWorkerRequest(
      new Request('https://example.com/'),
      createEnv(),
    )

    expect(response.status).toBe(200)
  })

  test('認証情報が設定されていれば未認証リクエストを弾く', async () => {
    const env = createEnv({ BASIC_AUTH_USER: 'user', BASIC_AUTH_PASS: 'pass' })
    const response = await handleWorkerRequest(
      new Request('https://example.com/'),
      env,
    )

    expect(response.status).toBe(401)
    expect(response.headers.get('WWW-Authenticate')).toContain(
      'realm="trip-oahu-2026"',
    )
  })

  test('正しい認証情報ならアセットを配信する', async () => {
    const env = createEnv({ BASIC_AUTH_USER: 'user', BASIC_AUTH_PASS: 'pass' })
    const request = new Request('https://example.com/', {
      headers: { Authorization: basicAuthHeader('user', 'pass') },
    })
    const response = await handleWorkerRequest(request, env)

    expect(response.status).toBe(200)
    await expect(response.text()).resolves.toBe(HOME_BODY)
  })

  test('誤った認証情報は拒否する', async () => {
    const env = createEnv({ BASIC_AUTH_USER: 'user', BASIC_AUTH_PASS: 'pass' })
    const request = new Request('https://example.com/', {
      headers: { Authorization: basicAuthHeader('user', 'wrong') },
    })
    const response = await handleWorkerRequest(request, env)

    expect(response.status).toBe(401)
  })

  test('user/pass の片方だけの設定は 503 で閉じる', async () => {
    const env = createEnv({ BASIC_AUTH_USER: 'user' })
    const response = await handleWorkerRequest(
      new Request('https://example.com/'),
      env,
    )

    expect(response.status).toBe(503)
  })
})
