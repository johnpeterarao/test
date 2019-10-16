import $ from 'jquery';
// import moment from 'moment';
// import 'moment-timezone';
// import countdown from './countdown';
import utils from '@bigcommerce/stencil-utils';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import modalFactory from '../global/modal';

export default function () {
    
    if (window.location.pathname === '/') {
        $.ajax({
            url: '/featured-categories/',
            type: 'POST',
            data: '',
            success: (response) => {
                const data = response;
                $('.homeFeaturedCategories').html($(data).find('ul.homeFeaturedCategoryWrapper').html());
            },
        });
        $.ajax({
            url: '/chirstmas-categories/',
            type: 'POST',
            data: '',
            success: (response) => {
                const data = response;
                $('.chirstmasCategories').html($(data).find('.chirstmasCategoriesWrapper').html());
            },
        });
        $.ajax({
            url: '/our-brands/',
            type: 'POST',
            data: '',
            success: (response) => {
                const data = response;
                $('.homeOurBrands').html($(data).find('div.homeOurBrandWrapper').html());
            },
        });
    }
   
    $(document).ready(function(){


        $(".mobileMenu-toggle").click(function(){
            // $(".mobileMenu-search-section").hide();
        });

        // Search Box
        $(".responsiveSearchBtn").click(function(){
            $(".mobileMenu-search-section").toggle();
            $('body').toggleClass('hasActiveSearch');
            if($('header').find('.navPages-container').hasClass('is-open')){
                $('header').find('.navPages-container').addClass('search-open')
            }
        });
        // Customer Support
        $('.customer-support-link').on('click', () => {
            if ($('.static-navigation-container').is(':hidden')) {
                $('.static-navigation-container').show();
            } else {
                $('.static-navigation-container').hide();
            }
        });

        if($('.navUser-item--account a:first').text() == "Account"){
            if($('.kidstuff-rewards-btn').length>0){
                $('.kidstuff-rewards-btn').hide();
            }
        }

        $(document).on('click', '.joinMailingListButton', (e) => {
             const mailingModal = modalFactory('#JoinMailingListModal')[0];
             mailingModal.open();
             mailingModal.updateContent('<script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/v2.js"></script><script>hbspt.forms.create({portalId: "4496789",formId: "1f6d1b39-7500-43b9-afd3-192bc86dbd9e"});</script>');
        });

        if ($('#memberRegistration').length > 0) {
            let pageUrl = '';
            let memberEmail = '';
            let memberMobile = '';
            
            pageUrl = window.location.search;
            pageUrl = pageUrl.replace('?', '');

            if (pageUrl.indexOf('memberEmail') < 0 || pageUrl.indexOf('mobile') < 0) {
                $('#formFieldShow').hide();
                $('#faultyUrlShow').show();
                return;
            }

            let diffrentParam = pageUrl.split('&');
            let x = 0;
            for (x in diffrentParam) {
                if (diffrentParam[x].indexOf('memberEmail') >= 0) {
                    memberEmail = diffrentParam[x].split('=');
                    memberEmail[1] = decodeURIComponent(memberEmail[1]);
                }

                if (diffrentParam[x].indexOf('mobile') >= 0) {
                    memberMobile = diffrentParam[x].split('=');
                    memberMobile[1] = decodeURIComponent(memberMobile[1]);
                }
            }

            const checkingUrl = 'https://randembigcommerce.randemgroup.com.au/kidstuff/application/Customers/checkCustomerIsMember?email=';
            const memRegMobUrl = '&mobile=';
            $.ajax({
                url: checkingUrl + memberEmail[1] + memRegMobUrl + memberMobile[1],
                type: 'GET',
                success: (response) => {
                    if (response === 'member') {
                        window.location = '/login.php';
                        return;
                    } else if (response === 'invalid') {
                        $('#formFieldShow').hide();
                        $('#faultyUrlShow').show();
                        return;
                    }
                },
            });

            $('#memberRegistration').on('submit', () => {
                const passWordVal = $.trim($('#member_password').val());
                const confPassWordVal = $.trim($('#member_conf_password').val());
                if (passWordVal === '' || passWordVal.length < 7) {
                    alert('Passwords must be at least 7 characters and contain both alphabetic and numeric characters.');
                    return false;
                }
                if (confPassWordVal === '') {
                    alert('You must enter confirm password.');
                    return false;
                }
                const result = passWordVal.match(new RegExp(/[A-Za-z]/)) && passWordVal.match(new RegExp(/[0-9]/));
                if (result === null) {
                    alert('Passwords must be at least 7 characters and contain both alphabetic and numeric characters.');
                    return false;
                }
                if (confPassWordVal !== passWordVal) {
                    alert('Your password and confirm password do not match.');
                    return false;
                }

                const memRegUrl = 'https://randembigcommerce.randemgroup.com.au/kidstuff/application/Customers/registerMember?email=';
                const memRegMobUrl = '&mobile=';
                const passUrl = '&password=';
                $.ajax({
                    url: memRegUrl + memberEmail[1] + memRegMobUrl + memberMobile[1] + passUrl + passWordVal,
                    type: 'GET',
                    success: (response) => {
                        if (response === 'Invalid Member') {
                            $('#formFieldShow').hide();
                            $('#faultyUrlShow').show();
                            return;
                        } else {
                            $('#memberDataCollectionPopUp').show();
                        }
                    },
                });
            });

            $('.closeOverlay1').on('click', () => {
                $('#memberDataCollectionPopUp').hide();
                window.location = '/login.php';
            });
            $('.memberFormNow').on('click', () => {
                const redirectLoc = '/experience/?memberEmail='
                const redirectLocMob = '&mobile=';
                window.location = redirectLoc + memberEmail[1] + redirectLocMob + memberMobile[1];
            });
        }

        if ($('.experience-feedback').length > 0) {
            let pageUrl = '';
            let memberEmail = '';
            let memberMobile = '';
            
            pageUrl = window.location.search;
            pageUrl = pageUrl.replace('?', '');

            
            let diffrentParam = pageUrl.split('&');
            let x = 0;
            for (x in diffrentParam) {
                if (diffrentParam[x].indexOf('memberEmail') >= 0) {
                    memberEmail = diffrentParam[x].split('=');
                    $('#memberEmail').val(memberEmail[1]);
                }

                if (diffrentParam[x].indexOf('mobile') >= 0) {
                    memberMobile = diffrentParam[x].split('=');
                    $('#memberMobile').val(memberMobile[1]);
                }
            }

            $('.step1indicator').on('click', () => {
                $('.stepIndicator').removeClass('active');
                $('.step1indicator').addClass('active');
                $('.formStep1').show();
                $('.formStep2').hide();
            });
            $('.step2indicator, .skipToStep2').on('click', () => {
                $('.stepIndicator').removeClass('active');
                $('.step2indicator').addClass('active');
                $('.formStep2').show();
                $('.formStep1').hide();
            });
            $('input:radio[name="buyingFor"]').on('change', (e) => {
                if ($(e.target).val() === 'No') {
                    $('.BuyingForTypeDiv').hide();
                } else if ($(e.target).val() === 'Yes') {
                    $('.BuyingForTypeDiv').show();
                }
            });
        }

        let atleastOneCheck = 'F';

        $('.cuntinueToStep2').on('click', () => {
            if ($('input[name="buyingFor"]:checked').val() === 'Yes') {
                if ($('#BuyingForType').val() !== '') {
                    atleastOneCheck = 'T';
                }
            }
            if ($('input[name="howManyKids"]:checked').val() !== undefined) {
                atleastOneCheck = 'T';
            }
            if ($('input.ChildAge:checked').length > 0) {
                atleastOneCheck = 'T';
            }
            if ($('input[name="oftenBuy"]:checked').val() !== undefined) {
                atleastOneCheck = 'T';
            }
            if (atleastOneCheck === 'F') {
                alert('Please filled up atleast one field before proceed to next step.');
                return true;
            } else {
                $('.stepIndicator').removeClass('active');
                $('.step2indicator').addClass('active');
                $('.formStep2').show();
                $('.formStep1').hide();
            }
        });

        $('.formFinalSubmit').on('click', () => {
            if ($('input.TypeOfToys:checked').length > 0) {
                atleastOneCheck = 'T';
            }
            if ($('#BrandNameRating').val() !== '') {
                atleastOneCheck = 'T';
            }
            if ($('#EducationalRating').val() !== '') {
                atleastOneCheck = 'T';
            }
            if ($('#PriceConsciousRating').val() !== '') {
                atleastOneCheck = 'T';
            }
            if ($('#LongLastingRating').val() !== '') {
                atleastOneCheck = 'T';
            }
            if ($('#TrendyRating').val() !== '') {
                atleastOneCheck = 'T';
            }
            if ($('#PlayValueRating').val() !== '') {
                atleastOneCheck = 'T';
            }

            if (atleastOneCheck === 'F') {
                alert('Please filled up atleast one field.');
                return true;
            } else {
                const mData = $('#memberDataCollect').serialize();
                $.ajax({
                    type: 'POST',
                    url: 'https://randembigcommerce.randemgroup.com.au/kidstuff/application/Customers/saveMemberInfo',
                    data: mData,
                    success: (response) => {
                        if ($('.expPage').length > 0) {
                            // alert('Thanks for filling up the form.');
                            // window.location = '/login.php';
                            const infoModal = modalFactory('#infoModal')[0];
                            infoModal.open();
                            infoModal.updateContent("<div>Stay tuned for great Kidstuff rewards & offers.</div>");
                        } else {
                            const infoModal = modalFactory('#infoModal')[0];
                            infoModal.open();
                            infoModal.updateContent("<div>Stay tuned for great Kidstuff rewards & offers.</div>");
                        }
                    },
                });
            }
        });

        $('.myInfoCustomClass a').on('click', () => {
            $('.navBar--account ul').find('li.is-active a').attr('href', $('.navBar--account ul').find('li.is-active a').attr('actual-href'));
            $('.navBar--account ul').find('li').removeClass('is-active');
            $('.navBar--account ul').find('li.myInfoCustomClass').addClass('is-active');
            $('.accountPageContent').hide();
            $('.accountMyInfo').show();
            $('.page-heading').text('My Info');
        });

        if ($('.accountMyInfo').length > 0) {
            const getMyInfoForEditURL = 'https://randembigcommerce.randemgroup.com.au/kidstuff/application/Customers/getMyInfoForEdit?email=';
            $.ajax({
                    type: 'GET',
                    url: getMyInfoForEditURL + $('#memberEmail').val(),
                    dataType: 'json',
                    success: (response) => {

                        const valueCloser = '"]';
                        const buyingForPre = 'input[name=buyingFor][value="';
                        $(buyingForPre + response.buyingFor + valueCloser).attr('checked', 'checked');

                        $('#BuyingForType').val(response.BuyingForType);

                        if (response.buyingFor === 'No') {
                            $('.BuyingForTypeDiv').hide();
                        }

                        const howManyKidsPre = 'input[name=howManyKids][value="';
                        $(howManyKidsPre + response.howManyKids + valueCloser).attr('checked', 'checked');
                        const oftenBuyPre = 'input[name=oftenBuy][value="';
                        $(oftenBuyPre + response.oftenBuy + valueCloser).attr('checked', 'checked');

                        $('#BrandNameRating').val(response.BrandNameRating);
                        $('#EducationalRating').val(response.EducationalRating);
                        $('#PriceConsciousRating').val(response.PriceConsciousRating);
                        $('#LongLastingRating').val(response.LongLastingRating);
                        $('#TrendyRating').val(response.TrendyRating);
                        $('#PlayValueRating').val(response.PlayValueRating);

                        $('.ChildAge').each((i, elem) => {
                            console.log($(elem).val());
                            console.log($.inArray($(elem).val(), response.ChildAge));
                            if ($.inArray($(elem).val(), response.ChildAge) !== -1) {
                                $(elem).attr('checked', 'checked');
                            }
                        });

                        $('.TypeOfToys').each((i, elem) => {
                            if ($.inArray($(elem).val(), response.TypeOfToys) !== -1) {
                                $(elem).attr('checked', 'checked');
                            }
                        });

                    },
                });
        }

        // Ad Modal
        // let hasModalAds = accessCookie('hasModalAds');
        // if (hasModalAds.length <= 0) {
        //     $('#modalAd').foundation('reveal','open');
        // }

        // Countdown Timer
        // let hasCountdown = accessCookie('hasCountdown');
        // let countdownOne = moment('2019-09-14').tz('Australia/Sydney'); // Til Sept. 13
        // let countdownTwo = moment('2019-09-15').tz('Australia/Sydney'); // Til Sept. 14(24 hrs)

        // let timer1 = {
        //     countdownDate: countdownOne,
        //     countdownMessage: `<p><span>Something exciting is coming this weekend!</span></p>
        //     <p>Make sure you're signed up and get <i><span>EARLY ACCESS</span></i></p>`,
        //     buttonLink: '/login.php?action=create_account',
        //     buttonLabel: 'Sign Up'
        // };

        // let timer2 = {
        //     countdownDate: countdownTwo,
        //     countdownMessage: `<p><span>Super Saturday</span> on NOW! <span>30% off SITEWIDE*</span></p>
        //     <p>T&C Apply. <span><i>Hurry, Ends soon!</i></span></p>`,
        //     buttonLink: '/',
        //     buttonLabel: 'Shop Now'
        // };

        // initCountdown(timer2);

        // $('.countdown__close').click(() => {
        //     $('.countdown--timer').hide();
        //     $('body').removeClass('hasCountdown');
        //     // createCookie('hasCountdown', 'yes', 100);
        // });

        // $('.ad_close--banner').click(() => {
        //     $('.ad_banner__container').hide();
        // });

        // $('.ad_close--modal').click(() => {
        //     createCookie('hasModalAds', 'no', 100);
        // });
    });

    // function initCountdown(timer) {
    //     let counterButton = `<a href="${timer.buttonLink}" class="countdown__button">${timer.buttonLabel}</a>`;    
    //     $('#countdownTimer').countdown({
    //         date: timer.countdownDate.toDate(),
    //         offset: +10,
    //         day: 'DAY',
    //         days: 'DAYS',
    //         hour: 'HR',
    //         hours: 'HRS',
    //         minute: 'MIN',
    //         minutes: 'MINS',
    //         second: 'SEC',
    //         seconds: 'SECS'
    //     }, function () {
    //         $('.countdown--timer').hide();
    //     });
    //     $('.countdown .countdown__text').html(timer.countdownMessage);
    //     $('.countdown .countdown__link').html(counterButton);
    //     $('.countdown--timer').show();
    // }

    function createCookie(cookieName, cookieValue, daysToExpire) {
        var date = new Date();
        date.setTime(date.getTime()+(daysToExpire*24*60*60*1000));
        document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
    }

    function accessCookie(cookieName) {
        var name = cookieName + "=";
        var allCookieArray = document.cookie.split(';');
        for(var i=0; i<allCookieArray.length; i++)
        {
            var temp = allCookieArray[i].trim();
            if (temp.indexOf(name)==0)
            return temp.substring(name.length,temp.length);
        }
        return "";
    }
}
