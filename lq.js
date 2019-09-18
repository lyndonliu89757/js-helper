const lq = lq || {}

/* Application paths *****************************************/

// Current application root path (including virtual directory if exists).
lq.appPath = lq.appPath || '/'
lq.pageLoadTime = new Date()

// Converts given path to absolute path using abp.appPath variable.
lq.toAbsAppPath = (path) => {
  if (path.indexOf('/') === 0) {
    path = path.substring(1)
  }

  return lq.appPath + path
}

/* MULTITENANCY */
lq.multiTenancy = lq.multiTenancy || {}

lq.multiTenancy.isEnabled = false

lq.multiTenancy.tenantIdCookieName = 'lq.TenantId'

lq.multiTenancy.setTenantIdCookie = (tenantId) => {
  if (tenantId) {
    lq.utils.setCookieValue(
      lq.multiTenancy.tenantIdCookieName,
      tenantId.toString(),
      lq.timing.fiveYear(),
      lq.appPath,
      lq.domain
    )
  } else {
    lq.utils.deleteCookie(lq.multiTenancy.tenantIdCookieName, lq.appPath)
  }
}

lq.multiTenancy.getTenantIdCookie = () => {
  var value = lq.utils.getCookie(lq.multiTenancy.tenantIdCookieName)
  if (!value) {
    return null
  }

  return parseInt(value)
}

/* TIMING *****************************************/
lq.timing = lq.timing || {}

lq.timing.now = () => {
  return new Date()
}

lq.timing.fiveYear = () => {
  return new Date(new Date().getTime() + 5 * 365 * 86400000)
}

/* UTILS ***************************************************/
lq.utils = lq.utils || {}

/**
 * Sets a cookie value for given key.
 * Please use a complete cookie library if you need.
 * @param {string} key
 * @param {string} value
 * @param {Date} expireDate (optional). If not specified the cookie will expire at the end of session.
 * @param {string} path (optional)
 */
lq.utils.setCookie = (key, value, expireDate, path, domain) => {
  var cookieValue = encodeURIComponent(key) + '='

  if (value) {
    cookieValue = cookieValue + encodeURIComponent(value)
  }

  if (expireDate) {
    cookieValue = cookieValue + '; expires=' + expireDate.toUTCString()
  }

  if (path) {
    cookieValue = cookieValue + '; path=' + path
  }

  if (domain) {
    cookieValue = cookieValue + '; domain=' + domain
  }

  document.cookie = cookieValue
}

/**
 * Gets a cookie with given key.
 * Please use a complete cookie library if you need.
 * @param {string} key
 * @returns {string} Cookie value or null
 */
lq.utils.getCookie = (key) => {
  var equalities = document.cookie.split('; ')
  for (var i = 0; i < equalities.length; i++) {
    if (!equalities[i]) {
      continue
    }

    var splitted = equalities[i].split('=')
    if (splitted.length !== 2) {
      continue
    }

    if (decodeURIComponent(splitted[0]) === key) {
      return decodeURIComponent(splitted[1] || '')
    }
  }

  return null
}

/**
 * Deletes cookie for given key.
 * @param {string} key
 * @param {string} path (optional)
 */
lq.utils.deleteCookie = (key, path) => {
  var cookieValue = encodeURIComponent(key) + '='

  cookieValue = cookieValue + '; expires=' + (new Date(new Date().getTime() - 86400000)).toUTCString()

  if (path) {
    cookieValue = cookieValue + '; path=' + path
  }

  document.cookie = cookieValue
}

/**
 * Gets the domain of given url
 * @param {string} url
 * @returns {string}
 */
lq.utils.getDomain = (url) => {
  var domainRegex = /(https?:){0,1}\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i
  var matches = domainRegex.exec(url)
  return (matches && matches[2]) ? matches[2] : ''
}

/* 判断是否为json对象 */
lq.utils.isJson = (obj) => {
  return typeof obj === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
}

/* 删除值为空的json键 */
lq.utils.fmtAbpRequstParam = function(obj) {
  if (!lq.utils.isJson(obj)) return obj

  const object = obj
  for (const i in object) {
    const val = object[i]
    if (typeof val === 'object') {
      if (Array.isArray(val)) {
        if (val.length === 0) {
          delete object[i]
          continue
        }
      }
      lq.utils.fmtAbpRequstParam(val)
    } else {
      if (val === '' || val === null || val === undefined) {
        delete object[i]
      }
    }
  }
  return object
}

export default lq
