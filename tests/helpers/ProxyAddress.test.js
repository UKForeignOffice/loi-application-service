const proxyaddr = require(
  require.resolve('proxy-addr', {
    paths: [require.resolve('sails-hook-sockets')],
  }),
)

describe('Sails socket proxy address handling', () => {
  it('uses mapped IPv6 trust subnets without trusting addresses outside the subnet', () => {
    const trust = proxyaddr.compile('::ffff:192.0.2.0/120')
    const trustedRequest = {
      connection: { remoteAddress: '::ffff:192.0.2.10' },
      headers: { 'x-forwarded-for': '198.51.100.55' },
    }
    const untrustedRequest = {
      connection: { remoteAddress: '::ffff:192.0.3.10' },
      headers: { 'x-forwarded-for': '198.51.100.55' },
    }

    expect(proxyaddr(trustedRequest, trust)).toBe('198.51.100.55')
    expect(proxyaddr.all(trustedRequest, trust)).toEqual(['::ffff:192.0.2.10', '198.51.100.55'])
    expect(proxyaddr(untrustedRequest, trust)).toBe('::ffff:192.0.3.10')
    expect(proxyaddr.all(untrustedRequest, trust)).toEqual(['::ffff:192.0.3.10'])
  })
})
