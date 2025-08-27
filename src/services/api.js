const baseURL = import.meta.env.VITE_BASE_URL

export const entitiesService = {
  async fetchEntities({
    page = 1,
    page_size = 25,
    sort_by = null,
    sort_dir = 'asc',
    global = null,
    filters = {}
  } = {}) {
    const url = new URL('/entities', baseURL)
    
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('page_size', page_size.toString())
    
    if (sort_by) {
      params.append('sort_by', sort_by)
      params.append('sort_dir', sort_dir)
    }
    
    if (global) {
      params.append('global', global)
    }
    
    Object.entries(filters).forEach(([column, value]) => {
      if (value && value.trim() !== '') {
        params.append(`filters[${column}]`, value)
      }
    })
    
    url.search = params.toString()
    
    try {
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('API Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}