---
layout: null
---

// Define a custom MMB container
(function(self, $, undefined) {

    var animationEnd = 'webkitAnimationEnd oanimationend msAnimationEnd animationend',
        defaultPageID = '#mmb-library'
        singlePageID = {
            '#blog':    '#mmb-blog',
            '#fiction': '#mmb-library',
            '#contact': '#mmb-contact',
            '#thanks':  '#mmb-thanks'
        }

    self.animate = function (selector, animation) {
        $(selector).one(animationEnd, function (e) {
            $(this).removeClass('animated ' + animation)
        }).addClass('animated ' + animation)
    }

    self.display = function (path, hash) {
        prepareLayout(path, hash)

        if (isIndexPage(path)) {
            hideContent()
            hash in singlePageID
                ? showContent(singlePageID[hash])
                : showContent(defaultPageID)
        }
    }

    function prepareLayout(path, hash) {
        var title = '.panel-main__inner',
            content = '.content-wrapper'

        if (isLandingPage(path, hash)) {
            if ($('.panel-cover').hasClass('panel-cover--collapsed')) {
                $('.panel-cover').removeClass('panel-cover--collapsed')
                $(content).hide()
            }
            MMB.animate(title, 'fadeIn')
        } else if (! $('.panel-cover').hasClass('panel-cover--collapsed')) {
            $('.panel-cover').addClass('panel-cover--collapsed')
            $(content).show()
            MMB.animate(title, 'fadeIn')
            MMB.animate(content, 'fadeIn')
        }
    }

    function isLandingPage(path, hash) {
        return isIndexPage(path) && !(hash && hash !== '#')
    }

    function isIndexPage(pagePath) {
        var indexRegEx = new RegExp('^\/(page[0-9]+\/)?(index(.html)?)?$');
        console.log('pagePath = ' + pagePath);
        return pagePath.match(indexRegEx);
    }

    function hideContent() {
        $.each(singlePageID, function (hash, selector) {
            $(selector).hide()
        })
    }

    function showContent(selector) {
        $(selector).show()
        self.animate(selector, 'fadeIn')
    }

}( window.MMB = window.MMB || {}, jQuery ))

// Run this code on page load
$(document).ready(function () {
    // Initial page load
    MMB.display(window.location.pathname, window.location.hash)

    // Update page content when URL hash changes
    $(window).on('hashchange', function () {
        MMB.display(this.location.pathname, this.location.hash)
    });

    // Mobile buttons
    $('.btn-mobile-menu').click(function () {
        $('.navigation-wrapper').toggleClass('visible animated bounceInDown')
        $('.btn-mobile-menu__icon').toggleClass('icon-list icon-x-circle animated fadeIn')
    })

    $('.navigation-wrapper .navigation__button').click(function () {
        $('.navigation-wrapper').toggleClass('visible')
        $('.btn-mobile-menu__icon').toggleClass('icon-list icon-x-circle animated fadeIn')
    })
})
