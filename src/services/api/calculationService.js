import calculationsData from "@/services/mockData/calculations.json"

class CalculationService {
  constructor() {
    this.calculations = [...calculationsData]
  }

  async getAll() {
    await this.delay(200)
    return [...this.calculations]
  }

  async getById(id) {
    await this.delay(200)
    return this.calculations.find(calc => calc.Id === parseInt(id))
  }

  async create(calculation) {
    await this.delay(300)
    const newId = this.calculations.length > 0 
      ? Math.max(...this.calculations.map(c => c.Id)) + 1 
      : 1
    
    const newCalculation = {
      Id: newId,
      ...calculation,
      timestamp: new Date().toISOString()
    }
    
    this.calculations.unshift(newCalculation)
    
    // Keep only last 50 calculations for performance
    if (this.calculations.length > 50) {
      this.calculations = this.calculations.slice(0, 50)
    }
    
    return { ...newCalculation }
  }

  async update(id, data) {
    await this.delay(300)
    const index = this.calculations.findIndex(calc => calc.Id === parseInt(id))
    if (index !== -1) {
      this.calculations[index] = { ...this.calculations[index], ...data }
      return { ...this.calculations[index] }
    }
    return null
  }

  async delete(id) {
    await this.delay(200)
    const index = this.calculations.findIndex(calc => calc.Id === parseInt(id))
    if (index !== -1) {
      const deleted = this.calculations.splice(index, 1)[0]
      return { ...deleted }
    }
    return null
  }

  async getRecent(limit = 5) {
    await this.delay(200)
    return this.calculations.slice(0, limit).map(calc => ({ ...calc }))
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new CalculationService()