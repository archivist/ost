import { Component } from 'substance'

class Header extends Component {
  didMount() {
    let hambEl = this.el.find('.hamburger')
    let subMenu = this.el.find('.fixed-header__submenu')
    hambEl.on('click', () => {
      if(hambEl.className.indexOf('active') > -1) {
        hambEl.className = 'hamburger'
        subMenu.className = 'fixed-header__submenu'
      } else {
        hambEl.className += ' active'
        subMenu.className += ' active'
      }
    })
  }

  render($$) {
    let el = $$('div').addClass('sc-header')
    
    el.setInnerHTML('<div class="fixed-header floated visible"><div class="fixed-header__inner"><h1 class="fixed-header__logo"><a href="http://tastorona.su/">Устная история военнопленных и&nbsp;остарбайтеров</a></h1><ul class="fixed-header__menu"><li><a href="http://tastorona.su/articles/" class="menu-icons menu-icons_01">Журнал</a></li><li><a href="http://tastorona.su/articles/educationals/" class="menu-icons menu-icons_02">Ликбез</a></li><li class="active"><a href="/" class="menu-icons menu-icons_03">Архив</a></li><li><a href="/maps" class="menu-icons menu-icons_04">Карты</a></li><li><a href="/persons" class="menu-icons menu-icons_05">Люди</a></li><li class="have-submenu"><span class="hamburger"><span class="icon"><span class="lines"></span></span></span></li></ul><ul class="fixed-header__submenu"><li><a href="http://tastorona.su/info/page/1">О проекте</a></li><li><a href="http://tastorona.su/info/page/2">Волонтёрам</a></li><li><a href="http://tastorona.su/info/page/3">Как пользоваться архивом</a></li><li><a href="http://tastorona.su/info/bibliography/">Библиография</a></li></ul></div></div>')
    
    return el
  }
}

export default Header