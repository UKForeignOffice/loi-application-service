const { expect } = require('chai')

const LocationService = require('../../../api/services/LocationService')

describe('LocationService', () => {
  describe('getReturnOption', () => {
    it('returns UK options for United Kingdom', () => {
      expect(LocationService.getReturnOption('United Kingdom')).to.deep.equal([7, 8])
    })

    it('returns EU option for countries in EU list', () => {
      expect(LocationService.getReturnOption('France')).to.deep.equal([9])
      expect(LocationService.getReturnOption('Germany')).to.deep.equal([9])
    })

    it('returns international option for non-EU countries', () => {
      expect(LocationService.getReturnOption('United States')).to.deep.equal([10])
      expect(LocationService.getReturnOption('Turkey')).to.deep.equal([10])
    })

    it('returns international option for empty or unknown country', () => {
      expect(LocationService.getReturnOption('')).to.deep.equal([10])
      expect(LocationService.getReturnOption('Neverland')).to.deep.equal([10])
    })
  })
})
