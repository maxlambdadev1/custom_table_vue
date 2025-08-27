const baseURL = import.meta.env.VITE_BASE_URL

export const customTablesService = {
  async fetchCustomTables() {
    const url = new URL('/dtables/list', baseURL)
    
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
      console.error('Custom Tables API Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export const entitiesService = {
  async fetchEntities({
    page = 1,
    page_size = 25,
    sort_by = null,
    sort_dir = 'asc',
    global = null,
    filters = {},
    customTableId = null
  } = {}) {
    // Use custom table endpoint if customTableId is provided
    const endpoint = customTableId ? '/dtables/fetch' : '/entities'
    const url = new URL(endpoint, baseURL)
    
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('page_size', page_size.toString())
    
    // Add config_id for custom tables
    if (customTableId) {
      params.append('config_id', customTableId.toString())
    }
    
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
      
      // Handle custom table response format
      if (customTableId && data.columns) {
        return {
          success: true,
          data: {
            results: data.results || [],
            total: data.total || 0,
            page: data.page || page,
            page_size: data.page_size || page_size,
            columns: data.columns || []
          }
        }
      }
      
      // Handle original entities response format  
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