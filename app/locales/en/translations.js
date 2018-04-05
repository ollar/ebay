export default {
  // "some.translation.key": "Text for some.translation.key",
  //
  // "a": {
  //   "nested": {
  //     "key": "Text for a.nested.key"
  //   }
  // },
  //
  // "key.with.interpolation": "Text with {{anInterpolation}}"

  links: {
    home: 'Home',
  },

  buttons: {
    submit: 'Submit',
  },

  navigation: {
    create_product: 'Create Product',
    logout: 'Log out',
  },

  footer: {
    footer_text: 'Made with \u2764 SPB 2018',
  },

  login: {
    title: 'Login',
    form: {
      username: {
        label: 'Username',
      },
    },
  },

  product_details: {
    buttons: {
      bid: 'Bid',
    },

    last_bidder: 'Last bidder - {{bidder.username}}',
  },

  bid: {
    title: 'Bid',
    notice: 'Please be responsible and avoid bidding until you are sure',
    preferable_price:
      'Preferable price for this product is {{preferablePrice}}',
    form: {
      bidPrice: {
        label: 'Bid Price',
      },
    },
  },

  create_product: {
    title: 'Create Product',
    form: {
      title: {
        label: 'Title',
      },
      description: {
        label: 'Description',
      },
      price: {
        label: 'Price',
      },
      preferablePrice: {
        label: 'Preferable Price',
      },
      bidStep: {
        label: 'Bid Step',
      },
    },
  },
};
