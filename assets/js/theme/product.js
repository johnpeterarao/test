/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/form-utils';

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#writeReview') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);

        videoGallery();

        const $reviewForm = classifyForm('.writeReview-form');
        const review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation();
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });
		
		if($('.ProductOptions').length > 0){
            if($.trim($('.ProductOptions').find("select:first").siblings('label').text().replace('Required', '').replace(/ /g, '')) != 'GiftCardAmount'){
                if($('.ProductOptions').find("select:first option:selected").text() === 'Choose Options' || $('.ProductOptions').find("select:first option:selected").text() === 'No Gift Wrapping'){
                    $('.ProductOptions').find("select:first").parent('div').next('div').hide();
                }
                
                $('.ProductOptions').find("select:first").change(function(){
                    if($('.ProductOptions').find("select:first option:selected").text() === 'Choose Options' || $('.ProductOptions').find("select:first option:selected").text() === 'No Gift Wrapping'){
                        $('.ProductOptions').find("select:first").parent('div').next('div').hide();
                    }else{
                        $('.ProductOptions').find("select:first").parent('div').next('div').show();
                    }
                });
            }else if($.trim($('.ProductOptions').find("select:first").siblings('label').text().replace('Required', '').replace(/ /g, '')) == 'GiftCardAmount'){
                $('[data-product-attribute=\'input-text\']').hide();
                $('[data-product-attribute=\'textarea\']').hide().find('textarea').val('');
                $('[data-product-attribute=\'set-radio\']').find('input[type="radio"]').click(function(e){
                    if($.trim($(e.target).next('label').text().replace(/ /g, '')) == 'Me'){
                        $('[data-product-attribute=\'input-text\']').hide().find('input[type="text"]').val('');
                        $('[data-product-attribute=\'textarea\']').hide().find('textarea').val('');
                    }else if($.trim($(e.target).next('label').text().replace(/ /g, '')) == 'Other'){
                        $('[data-product-attribute=\'input-text\']').show();
                        $('[data-product-attribute=\'textarea\']').show();
                    }
                });
            }
        }
		
		

        next();
    }

    after(next) {
        this.productReviewHandler();

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.click();
        }
    }
}
