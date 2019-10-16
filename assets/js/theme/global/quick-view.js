import $ from 'jquery';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.dropdown';
import utils from '@bigcommerce/stencil-utils';
import ProductDetails from '../common/product-details';
import { defaultModal } from './modal';

export default function (context) {
    const modal = defaultModal();

    $('body').on('click', '.quickview', (event) => {
        event.preventDefault();

        const productId = $(event.currentTarget).data('product-id');

        modal.open({ size: 'large' });

        utils.api.product.getById(productId, { template: 'products/quick-view' }, (err, response) => {
            modal.updateContent(response);

            modal.$content.find('.productView').addClass('productView--quickView');
			
			$('.productCarousel').slick({
				"dots": true,
				"infinite": true,
				"mobileFirst": true,
				"slidesToShow": 1,
				"slidesToScroll": 1,
				"responsive": [
					{
						"breakpoint": 1260,
						"settings": {
							"slidesToScroll": 1,
							"slidesToShow": 1
						}
					},
					{
						"breakpoint": 800,
						"settings": {
							"slidesToScroll": 1,
							"slidesToShow": 1
						}
					},
					{
						"breakpoint": 550,
						"settings": {
							"slidesToScroll": 1,
							"slidesToShow": 1
						}
					}
				]
			});

            return new ProductDetails(modal.$content.find('.quickView'), context);
        });
		
		/**/
		
		console.log('Quick Vew');
    });
}
