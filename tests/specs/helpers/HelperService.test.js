const { expect } = require('chai')

const HelperService = require('../../../api/services/HelperService')

describe('HelperService', () => {
  describe('buildArraysOfDocsCertAndWetInk', () => {
    it('returns null when there is no body and no session fallback input', () => {
      const req = {
        body: null,
        session: {},
        allParams: () => ({}),
      }

      const result = HelperService.buildArraysOfDocsCertAndWetInk(req, {}, [])

      expect(result).to.equal(null)
    })

    it('builds certification and wet-ink arrays from request parameters', () => {
      const req = {
        body: {
          submitted: true,
        },
        session: {},
        allParams: () => ({
          docid_12: 'option_certReq',
          docid_34: 'option_wetInk',
        }),
      }

      const userDocs = [
        { doc_id: 12, doc_title: 'Birth certificate' },
        { doc_id: 34, doc_title: 'Marriage certificate' },
      ]

      const result = HelperService.buildArraysOfDocsCertAndWetInk(req, {}, userDocs)

      expect(result).to.deep.equal({
        certReqDocs: ['12'],
        wetInkDocs: ['34'],
      })
    })

    it('uses session eligible_input when body is missing', () => {
      const req = {
        body: null,
        session: {
          eligible_input: {
            docid_77: 'choice_certReq',
            docid_88: 'choice_wetInk',
          },
        },
        allParams: () => ({}),
      }

      const userDocs = [
        { doc_id: 77, doc_title: 'Adoption certificate' },
        { doc_id: 88, doc_title: 'Name deed' },
      ]

      const result = HelperService.buildArraysOfDocsCertAndWetInk(req, {}, userDocs)

      expect(result).to.deep.equal({
        certReqDocs: ['77'],
        wetInkDocs: ['88'],
      })
    })

    it('does not duplicate document ids when parameters are processed repeatedly', () => {
      const req = {
        body: {
          submitted: true,
        },
        session: {},
        allParams: () => ({
          docid_55: 'a_certReq',
          docid_55_extra: 'b_certReq',
          docid_99: 'c_wetInk',
        }),
      }

      const userDocs = [
        { doc_id: 55, doc_title: 'Certificate A' },
        { doc_id: 99, doc_title: 'Certificate B' },
      ]

      const result = HelperService.buildArraysOfDocsCertAndWetInk(req, {}, userDocs)

      expect(result.certReqDocs).to.include('55')
      expect(result.wetInkDocs).to.deep.equal(['99'])
      expect(result.certReqDocs.filter((id) => id === '55').length).to.equal(1)
    })
  })
})
