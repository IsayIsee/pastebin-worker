import { NAME_REGEX, PASSWD_SEP } from "../../shared/constants.js"
import { parseExpiration, parseExpirationReadable } from "../../shared/parsers.js"

export const BaseUrl = DEPLOY_URL
export const APIUrl = API_URL

export const maxExpirationSeconds = parseExpiration(MAX_EXPIRATION)!
export const maxExpirationReadable = parseExpirationReadable(MAX_EXPIRATION)!

export class ErrorWithTitle extends Error {
  public title: string

  constructor(title: string, msg: string) {
    super(msg)
    this.title = title
  }
}

export function formatSize(size: number): string {
  if (!size) return "0"
  if (size < 1024) {
    return `${size} Bytes`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`
  } else {
    return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`
  }
}

export function verifyExpiration(expiration: string): [boolean, string] {
  const parsed = parseExpiration(expiration)
  if (parsed === null) {
    return [false, "过期时间格式错误"]
  } else {
    if (parsed > maxExpirationSeconds) {
      return [false, `超出最长期限 (${maxExpirationReadable})`]
    } else {
      return [true, `将于 ${parseExpirationReadable(expiration)!} 后失效`]
    }
  }
}

export function verifyName(name: string): [boolean, string] {
  if (name.length < 3) {
    return [false, "应至少包含 3 个字符"]
  } else if (!NAME_REGEX.test(name)) {
    return [false, "仅允许字母数字及 +_-[]*$@,;"]
  } else {
    return [true, ""]
  }
}

export function verifyManageUrl(url: string): [boolean, string] {
  try {
    const url_parsed = new URL(url)
    if (url_parsed.origin !== BaseUrl) {
      return [false, `URL 必须以 ${BaseUrl} 开头`]
    } else if (url_parsed.pathname.indexOf(PASSWD_SEP) < 0) {
      return [false, `URL 必须包含冒号`]
    } else {
      return [true, ""]
    }
  } catch (e) {
    if (e instanceof TypeError) {
      return [false, "无效 URL"]
    } else {
      throw e
    }
  }
}
