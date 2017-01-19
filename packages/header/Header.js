import { Component } from 'substance'

class Header extends Component {
  render($$) {
    let el = $$('div').addClass('sc-header')
    
    el.setInnerHTML('<div class="fixed-header floated visible"><div class="fixed-header__inner"><h1 class="fixed-header__logo"><a href="http://tastorona.su">Устная история военнопленных и&nbsp;остарбайтеров</a></h1><ul class="fixed-header__menu"><li><a href="http://tastorona.su/articles" class="menu-icons menu-icons_01">Журнал</a></li><li><a href="http://tastorona.su/articles/educational/2" class="menu-icons menu-icons_02">Ликбез</a></li><li class="archive active"><a href="/" class="menu-icons menu-icons_03">Архив</a></li><li class="maps"><a href="/maps" class="menu-icons menu-icons_04">Карты</a></li><li onclick="javascript:$(".fixed-header__submenu").toggleClass("active")" class="have-submenu"><span class="hamburger"><span class="icon"></span></span></li></ul><ul class="fixed-header__submenu"><li><a href="http://tastorona.su/info/page/1">О проекте</a></li><li><a href="http://tastorona.su/info/page/2">Волонтёрам</a></li><li><a href="http://tastorona.su/info/page/3">Как пользоваться архивом</a></li><li><a href="http://tastorona.su/info/bibliography">Волонтёрам</a></li></ul></div></div>')
    
    return el
  }
}

export default Header