import { describe, expect, it } from 'vitest'
import { Slug } from "./slug";

describe('Slug', () => {
  it('should be able a create a slug', () => {
    const slug = Slug.createFromText('Example question title')

    expect(slug.value).toEqual('example-question-title')
  })
})