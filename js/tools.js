var sliderPeriod    = 5000;
var sliderTimer     = null;

$(document).ready(function() {

    $('.slider').each(function() {
        var curSlider = $(this);
        curSlider.data('curIndex', 0);
        curSlider.data('disableAnimation', true);
        var curHTML = '';
        curSlider.find('.slider-content li').each(function() {
            curHTML += '<a href="#"></a>';
        });
        $('.slider-ctrl').html(curHTML);
        $('.slider-ctrl a:first').addClass('active');
        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
    });

    function sliderNext() {
        var curSlider = $('.slider');

        if (curSlider.data('disableAnimation')) {
            var curIndex = curSlider.data('curIndex');
            var newIndex = curIndex + 1;
            if (newIndex >= curSlider.find('.slider-content li').length) {
                newIndex = 0;
            }

            curSlider.data('curIndex', newIndex);
            curSlider.data('disableAnimation', false);

            curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
            curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1}).show();

            curSlider.find('.slider-ctrl a.active').removeClass('active');
            curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

            curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                curSlider.data('disableAnimation', true);
                sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
            });
        }
    }

    $('.slider').on('click', '.slider-ctrl a', function(e) {
        if (!$(this).hasClass('active')) {
            window.clearTimeout(sliderTimer);
            sliderTimer = null;

            var curSlider = $('.slider');
            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                var newIndex = $('.slider-ctrl a').index($(this));

                curSlider.data('curIndex', newIndex);
                curSlider.data('disableAnimation', false);

                curSlider.find('.slider-content li').eq(curIndex).css({'z-index': 2});
                curSlider.find('.slider-content li').eq(newIndex).css({'z-index': 1}).show();

                curSlider.find('.slider-ctrl a.active').removeClass('active');
                curSlider.find('.slider-ctrl a').eq(newIndex).addClass('active');

                curSlider.find('.slider-content li').eq(curIndex).fadeOut(function() {
                    curSlider.data('disableAnimation', true);
                    sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                });
            }
        }

        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('.catalogue-text-more a').click(function(e) {
        $(this).parent().prev().toggleClass('open');
        e.preventDefault();
    });

    $('.product-photo-preview ul li a').click(function(e) {
        var curLink = $(this);
        var curLi = curLink.parent();
        if (!curLink.parent().hasClass('active')) {
            $('.product-photo-preview ul li.active').removeClass('active');
            curLi.addClass('active');
            $('.product-photo-big a').attr('href', curLink.attr('rel'));
            $('.product-photo-big img').attr('src', curLink.attr('href'));
            $('.cloud-zoom').data('zoom').destroy();
            $('.cloud-zoom').CloudZoom();
        }
        e.preventDefault();
    });

    $('body').on('click', '.mousetrap', function(e) {
        var curArray = [];
        $('.product-photo-preview a').each(function() {
            curArray.push({href: $(this).attr('rel')});
        });
        var curIndex = $('.product-photo-preview li').index($('.product-photo-preview li.active'));
        $.fancybox.open(curArray, {
            tpl : {
                closeBtn : '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next     : '<a title="Следующая" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev     : '<a title="Предыдущая" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },
            index: curIndex
        });
    });

    $('.product-order .btn-2').click(function(e) {
        var curForm = $(this).parent();
        $.ajax({
            type: 'POST',
            url: curForm.attr('action'),
            data: curForm.serialize(),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            if ($('.window').length > 0) {
                windowClose();
            }
            windowOpen(html);
        });
        e.preventDefault();
    });

    $('.listInCart').click(function(e) {
        var curForm = $(this).parent();
        $.ajax({
            type: 'POST',
            url: '/local/ajax/store/addtobasket.php',
            data: {desc: $(this).data('desc'),product: $(this).data('product'),sizeID: $(this).data('sizeid') },
            dataType: 'html',
            cache: false
        }).done(function(html) {
            if ($('.window').length > 0) {
                windowClose();
            }
            windowOpen(html);
        });
        e.preventDefault();
    });

    $('body').on('click', '.product-shops-item', function() {
        $('.product-shops-item.open').removeClass('open');
        $(this).addClass('open');
    });

    $('.catalogue-recommend').each(function() {
        var curBlock = $(this);
        var curHTML = '<ul>';
        curBlock.find('.recommend-tab').each(function() {
            if($(this).data('title') != undefined)
              curHTML += '<li><a href="#">' + $(this).data('title') + '</a></li>';
        });
        curHTML += '</ul>';
        if(curHTML != "<ul></ul>"){
          $(".catalogue-recommend").show();
          curBlock.find('.recommend-menu').prepend(curHTML);
          curBlock.find('.recommend-menu li:first').addClass('active');
          if (curBlock.find('.recommend-menu li').length > 0) {
              curBlock.find('.recommend-menu').show();
          }
          curBlock.find('.recommend-tab:first').addClass('active');
        }else{
        }
    });

    $('.catalogue-recommend').on('click', '.recommend-menu ul li a', function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            var curIndex = $('.recommend-menu ul li').index(curLi);
            $('.recommend-menu ul li.active').removeClass('active');
            curLi.addClass('active');

            curLi.parent().parent().next().find('.recommend-tab.active').removeClass('active');
            curLi.parent().parent().next().find('.recommend-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.catalogue-list').on('click', '.catalogue-list-ctrl a', function(e) {
        var pageSize = 4;
        if ($(window).width() < 1200) {
            pageSize = 3;
        }
        if ($(window).width() < 768) {
            pageSize = 2;
        }
        var curList = $(this).parents().filter('.catalogue-list');
        var curIndex = curList.find('.catalogue-list-ctrl a').index($(this));
        curList.find('.catalogue-item:first').stop(true, true);
        curList.find('.catalogue-list-ctrl a.active').removeClass('active');
        $(this).addClass('active');
        curList.find('.catalogue-item:first').animate({'margin-left': -curIndex * pageSize * curList.find('.catalogue-item:first').outerWidth()});
        e.preventDefault();
    });

    $('body').on('click', '.window-link', function(e) {
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            if ($('.window').length > 0) {
                windowClose();
            }
            windowOpen(html);
        });
        e.preventDefault();
    });

    $('body').on('click', '.basket-window-close', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').on('click', '.to-basket-btns .btn-1', function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.contacts-list').jScrollPane({
        autoReinitialise: true
    });

    $('.nav-main-link').click(function(e) {
        if ($('html').hasClass('nav-main-open')) {
            $('html').removeClass('nav-main-open');
            $(window).scrollTop($('body').data('scrollTop'));
        } else {
            $('body').data('scrollTop', $(window).scrollTop());
            $('html').addClass('nav-main-open');
        }
        e.preventDefault();
    });

    $(window).on('load resize scroll', function() {
        if ($(window).scrollTop() > 0) {
            $('html').addClass('has-scroll');
        } else {
            $('html').removeClass('has-scroll');
        }
    });

    $('.contacts-menu ul li a').click(function(e) {
        var curLi = $(this).parent();
        if (!curLi.hasClass('active')) {
            $('.contacts-menu ul li.active').removeClass('active');
            curLi.addClass('active');

            var curIndex = $('.contacts-menu ul li').index(curLi);
            $('.cols-contacts .col.active').removeClass('active');
            $('.cols-contacts .col').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.header-phone-mobile').click(function(e) {
        $('html').toggleClass('header-phone-open');
        e.preventDefault();
    });

    $('.side-mobile-link').click(function(e) {
        $('html').toggleClass('side-mobile-visible');
        if ($('html').hasClass('side-mobile-visible')) {
            var dpr = 1;
            if (window.devicePixelRatio !== undefined) {
                dpr = window.devicePixelRatio;
            }

            $('body').height($(window).height() * dpr);
        } else {
            $('body').removeAttr('style');
        }
        e.preventDefault();
    });

    $(window).on('load resize', function() {
        $('.recommend-menu li:first-child').css({'margin-left': 0});
        $('.recommend-menu').data('curIndex', 0);
        $('.recommend-menu ul li:first a').each(function() {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curIndex = $('.recommend-menu ul li').index(curLi);
                $('.recommend-menu ul li.active').removeClass('active');
                curLi.addClass('active');

                curLi.parent().parent().next().find('.recommend-tab.active').removeClass('active');
                curLi.parent().parent().next().find('.recommend-tab').eq(curIndex).addClass('active');
            }
        });
    });

    $('.recommend-menu-next').click(function(e) {
        var curIndex = $('.recommend-menu').data('curIndex');
        curIndex++;
        if (curIndex >= $('.recommend-menu li').length) {
            curIndex = 0;
        }
        $('.recommend-menu').data('curIndex', curIndex);
        $('.recommend-menu li:first-child').stop(true, true);
        $('.recommend-menu li:first-child').animate({'margin-left': -curIndex * $('.recommend-menu li:first-child').outerWidth()});
        $('.recommend-menu li').eq(curIndex).find('a').click();
        e.preventDefault();
    });

    $('.recommend-menu-prev').click(function(e) {
        var curIndex = $('.recommend-menu').data('curIndex');
        curIndex--;
        if (curIndex < 0) {
            curIndex = $('.recommend-menu li').length - 1;
        }
        $('.recommend-menu').data('curIndex', curIndex);
        $('.recommend-menu li:first-child').stop(true, true);
        $('.recommend-menu li:first-child').animate({'margin-left': -curIndex * $('.recommend-menu li:first-child').outerWidth()});
        $('.recommend-menu li').eq(curIndex).find('a').click();
        e.preventDefault();
    });

    $('.catalogue-menu li a.catalogue-menu-sublink').click(function(e) {
        $(this).parent().toggleClass('open');
        e.preventDefault();
    });

    var navMainTimer = null;
    $('.nav-main').mouseover(function() {
        var curMenu = $(this);
        window.clearTimeout(navMainTimer);
        navMainTimer = null;

        navMainTimer = window.setTimeout(function() {
            curMenu.addClass('hover');
        }, 300);
    });

    $('.nav-main').mouseout(function() {
        window.clearTimeout(navMainTimer);
        navMainTimer = null;

        navMainTimer = window.setTimeout(function() {
            $('.nav-main.hover').removeClass('hover');
        }, 300);
    });

    var navMenuTimer = null;
    $('.nav-menu > ul > li.with-submenu').mouseover(function() {
        var curMenu = $(this);
        window.clearTimeout(navMenuTimer);
        navMenuTimer = null;

        navMenuTimer = window.setTimeout(function() {
            $('.nav-menu > ul > li.hover').removeClass('hover');
            curMenu.addClass('hover');
        }, 300);
    });

    $('.nav-menu > ul > li.with-submenu').mouseout(function() {
        window.clearTimeout(navMenuTimer);
        navMenuTimer = null;

        navMenuTimer = window.setTimeout(function() {
            $('.nav-menu > ul > li.hover').removeClass('hover');
        }, 300);
    });

    var mainSectionsTimer = null;
    $('.main-section-inner').mouseover(function() {
        var curMenu = $(this);
        window.clearTimeout(mainSectionsTimer);
        mainSectionsTimer = null;

        mainSectionsTimer = window.setTimeout(function() {
            $('.main-section-inner.hover').removeClass('hover');
            curMenu.addClass('hover');
        }, 300);
    });

    $('.main-section-inner').mouseout(function() {
        window.clearTimeout(mainSectionsTimer);
        mainSectionsTimer = null;

        mainSectionsTimer = window.setTimeout(function() {
            $('.main-section-inner.hover').removeClass('hover');
        }, 300);
    });

    $('.nav-search-link').click(function(e) {
        $('.nav-search').toggleClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.nav-search').length == 0) {
            $('.nav-search').removeClass('open');
        }
    });

    $('.footer-callback-link').click(function(e) {
        $('.footer-callback').toggleClass('open');
        e.preventDefault();
    });

    $('.footer-callback-window-close').click(function(e) {
        $('.footer-callback').removeClass('open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.footer-callback').length == 0) {
            $('.footer-callback').removeClass('open');
        }
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            $('.footer-callback').removeClass('open');
        }
    });

    $('.product-link-gift, .product-link-delivery').click(function(e) {
        var curLink = $(this);
        $.ajax({
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            if ($('.product-links-window').length > 0) {
                $('.product-links-window').remove();
            }
            $('.product-links').append('<div class="product-links-window">' + html + '<a href="#" class="product-links-window-close"></a></div>');
            $('.product-links-window-scroll').jScrollPane({
                autoReinitialise: true
            });
            initForm($('.gift-window form'));

            $('.product-links-window-close').click(function(e) {
                $('.product-links-window').remove();
                e.preventDefault();
            });

        });
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.product-links').length == 0) {
            $('.product-links-window').remove();
        }
    });

    $('body').bind('keyup', function(e) {
        if (e.keyCode == 27) {
            $('.product-links-window').remove();
        }
    });

    $('body').on('click', '.selected-shop-link a', function(e) {
        $.ajax({
            type: 'POST',
            url: $(this).attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(html) {
            if ($('.window').length > 0) {
                windowClose();
            }
            windowOpen(html);
            ymaps.ready(init);
            $('.select-shops .contacts-list').jScrollPane({
                autoReinitialise: true
            });
        });
        e.preventDefault();
    });

    $('body').on('click', '.select-shops .btn-2', function(e) {
        var curSelect = $('.select-shops .product-shops-item.open');
        if (curSelect.length == 1) {
            $('input[name="selectedShop"]').val(curSelect.find('input').val());
            $('.selected-shop-title span').html(curSelect.find('.product-shops-item-name span').html());
            $('.selected-shop-address').html(curSelect.find('.product-shops-item-detail dd').eq(0).html());
        }
        windowClose();
        e.preventDefault();
    });

    $('.bx-filter-input-checkbox input').change(function() {
        var curField = $(this).parent();
        $('.bx-filter-input-checkbox.focus').removeClass('focus');
        curField.addClass('focus');
    });

    $('.bx-filter-input-checkbox input').change(function() {
        var curField = $(this).parent();
        $('.bx-filter-input-checkbox.focus').removeClass('focus');
        curField.addClass('focus');
    });

    $('.product-order-rings').each(function() {
        if ($(this).find('.form-size').length > 0) {
            $(this).addClass('product-order-rings-with-size');
        }
    });

    $('.side').on('click', '.bx-filter-popup-result .close', function() {
        $('.bx-filter-popup-result').hide();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.bx-filter-popup-result').length == 0) {
            $('.bx-filter-popup-result').hide();
        }
    });

    $('body').on('click', '.message-error-back-link', function(e) {
        $(this).parents().filter('.message-error').remove();
        e.preventDefault();
    });

});

$(window).on('resize', function() {
    $('.form-select select').chosen('destroy');
    $('.form-select select').chosen({disable_search: true, placeholder_text_multiple: ' ', no_results_text: 'Нет результатов'});
});

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-select select').chosen({disable_search: true, no_results_text: 'Нет результатов'});

    curForm.find('input[type="number"]').each(function() {
        var curBlock = $(this).parent();
        var curHTML = curBlock.html();
        curBlock.html(curHTML.replace(/type=\"number\"/g, 'type="text"'));
        curBlock.find('input').spinner();
        curBlock.find('input').keypress(function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode
            if (charCode > 31 && (charCode < 43 || charCode > 57)) {
                return false;
            }
            return true;
        });
    });

    curForm.find('.form-file input').change(function() {
        var curInput = $(this);
        var curField = curInput.parent().parent();
        curField.find('.form-file-name').html(curInput.val().replace(/.*(\/|\\)/, ''));
        curField.find('label.error').remove();
        curField.removeClass('error');
    });

    if (curForm.parent().hasClass('subscribe')) {
        curForm.validate({
            submitHandler: function(form, validatorcalc) {
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: $(form).serialize(),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    if ($('.window').length > 0) {
                        windowClose();
                    }
                    windowOpen(html);
                });
            }
        });
    } else if (curForm.hasClass('ajaxForm')) {
        curForm.validate({
            ignore: '',
            submitHandler: function(form, validatorcalc) {
                $(form).append('<div class="loading"><div class="loading-text">Отправка данных</div></div>');
                $.ajax({
                    type: 'POST',
                    url: $(form).attr('action'),
                    data: $(form).serialize(),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    $(form).find('.loading').remove();
                    $(form).append(html);
                });
            }
        });
    } else {
        curForm.validate({
        ignore: '',
        invalidHandler: function(form, validatorcalc) {
            validatorcalc.showErrors();
            checkErrors();
        }
    });
  }
}

function checkErrors() {
    $('.form-checkbox, .form-input, .form-file').each(function() {
        var curField = $(this);
        if (curField.find('input.error').length > 0 || curField.find('textarea.error').length > 0) {
            curField.addClass('error');
        } else {
            curField.removeClass('error');
        }
        if (curField.find('input.valid').length > 0 || curField.find('textarea.valid').length > 0) {
            curField.addClass('valid');
        } else {
            curField.removeClass('valid');
        }
    });
}

function resizeCatalogue(curList) {
    curList.find('.catalogue-item-photo').css({'min-height': 0 + 'px'});

    curList.find('.catalogue-item-photo').each(function() {
        var curBlock = $(this);
        var curHeight = curBlock.height();
        var curTop = curBlock.offset().top;

        curList.find('.catalogue-item-photo').each(function() {
            var otherBlock = $(this);
            if (otherBlock.offset().top == curTop) {
                var newHeight = otherBlock.height();
                if (newHeight > curHeight) {
                    curBlock.css({'min-height': newHeight + 'px', 'line-height': newHeight + 'px'});
                } else {
                    otherBlock.css({'min-height': curHeight + 'px', 'line-height': newHeight + 'px'});
                }
            }
        });
    });

    curList.find('.catalogue-item-text').css({'min-height': 0 + 'px'});

    curList.find('.catalogue-item-text').each(function() {
        var curBlock = $(this);
        var curHeight = curBlock.height();
        var curTop = curBlock.offset().top;

        curList.find('.catalogue-item-text').each(function() {
            var otherBlock = $(this);
            if (otherBlock.offset().top == curTop) {
                var newHeight = otherBlock.height();
                if (newHeight > curHeight) {
                    curBlock.css({'min-height': newHeight + 'px'});
                } else {
                    otherBlock.css({'min-height': curHeight + 'px'});
                }
            }
        });
    });
}

$(window).on('load resize', function() {

    $('.catalogue-list').each(function() {
        resizeCatalogue($(this));
    });

    $('.catalogue-text-wrap').each(function() {
        var curBlock = $(this);
        curBlock.removeClass('hidden open');
        if (curBlock.height() < curBlock.find('.catalogue-text-inner').height()) {
            curBlock.addClass('hidden');
        }
    });

    $('.recommend-tab').each(function() {
        var curList = $(this).find('.catalogue-list');
        var pageSize = 4;
        if ($(window).width() < 1200) {
            pageSize = 3;
        }
        if ($(window).width() < 768) {
            pageSize = 2;
        }
        var curPages = Math.ceil(curList.find('.catalogue-item').length / pageSize);
        if (curPages > 1) {
            var curHTML = '';
            for (var i = 0; i < curPages; i++) {
                curHTML += '<a href="#"></a>';
            }
            curList.find('.catalogue-list-ctrl').html(curHTML);
            curList.find('.catalogue-list-ctrl a:first-child').addClass('active');
        } else {
            curList.find('.catalogue-list-ctrl').html('');
        }
        curList.find('.catalogue-item:first').css({'margin-left': 0});
    });

});

function windowOpen(contentWindow) {
    var windowWidth     = $(window).width();
    var windowHeight    = $(window).height();
    var curScrollTop    = $(window).scrollTop();
    var curScrollLeft   = $(window).scrollLeft();

    var bodyWidth = $('body').width();
    $('body').css({'height': windowHeight, 'overflow': 'hidden'});
    var scrollWidth =  $('body').width() - bodyWidth;
    $('body').css({'padding-right': scrollWidth + 'px'});
    $(window).scrollTop(0);
    $(window).scrollLeft(0);
    $('body').css({'margin-top': -curScrollTop});
    $('body').data('scrollTop', curScrollTop);
    $('body').css({'margin-left': -curScrollLeft});
    $('body').data('scrollLeft', curScrollLeft);

    $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-loading"></div><div class="window-container window-container-load"><div class="window-content">' + contentWindow + '<a href="#" class="window-close">Закрыть</a></div></div></div>')

    if ($('.window-container img').length > 0) {
        $('.window-container img').each(function() {
            $(this).attr('src', $(this).attr('src'));
        });
        $('.window-container').data('curImg', 0);
        $('.window-container img').load(function() {
            var curImg = $('.window-container').data('curImg');
            curImg++;
            $('.window-container').data('curImg', curImg);
            if ($('.window-container img').length == curImg) {
                $('.window-loading').remove();
                $('.window-container').removeClass('window-container-load');
                windowPosition();
            }
        });
    } else {
        $('.window-loading').remove();
        $('.window-container').removeClass('window-container-load');
        windowPosition();
    }

    $('.window-close').click(function(e) {
        windowClose();
        e.preventDefault();
    });

    $('.window-overlay').click(function(e) {
        windowClose();
        e.preventDefault();
    });

    $('body').bind('keyup', keyUpBody);

    $('.window form').each(function() {
        initForm($(this));
    });

}

function windowPosition() {
    var dpr = 1;
    if (window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    }

    var windowWidth     = $(window).width() * dpr;
    var windowHeight    = $(window).height() * dpr;

    if ($('.window-container').width() > windowWidth - 40) {
        $('.window-container').css({'left': 20, 'margin-left': 0});
        $('.window-overlay').width($('.window-container').width() + 40);
    } else {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});
        $('.window-overlay').width('100%');
    }

    if ($('.window-container').height() > windowHeight - 40) {
        $('.window-overlay').height($('.window-container').height() + 40);
        $('.window-container').css({'top': 20, 'margin-top': 0});
    } else {
        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2});
        $('.window-overlay').height('100%');
    }
}

function keyUpBody(e) {
    if (e.keyCode == 27) {
        windowClose();
    }
}

function windowClose() {
    $('body').unbind('keyup', keyUpBody);
    $('.window').remove();
    $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
    $(window).scrollTop($('body').data('scrollTop'));
    $(window).scrollLeft($('body').data('scrollLeft'));
}

$(window).resize(function() {
    if ($('.window').length > 0) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        $('body').css({'height': '100%', 'overflow': 'visible', 'padding-right': 0, 'margin': 0});
        var bodyWidth = $('body').width();
        $('body').css({'height': windowHeight, 'overflow': 'hidden'});
        var scrollWidth =  $('body').width() - bodyWidth;
        $('body').css({'padding-right': scrollWidth + 'px'});
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
        $('body').data('scrollTop', 0);
        $('body').data('scrollLeft', 0);

        windowPosition();
    }
});