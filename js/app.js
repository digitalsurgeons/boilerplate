import 'babel-polyfill'
import $ from 'jquery'

// ==========================================================================
// Components
// ==========================================================================
import Header from '../components/Header'

new Header($('[data-header]'), {
  message: 'hello!'
})
