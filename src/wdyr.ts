import React from 'react'
import whyDidYouRender from '@welldone-software/why-did-you-render'

// Chỉ bật khi dev. Component nào gắn `X.whyDidYouRender = true` sẽ được log lý do re-render.
if (import.meta.env.DEV) {
  whyDidYouRender(React, { trackAllPureComponents: false })
}
