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

  common: {
    by: 'by',
    on: 'on',
  },

  links: {
    home: 'Home',
  },

  buttons: {
    submit: 'Submit',
    cancel: 'Cancel',
  },

  messages: {
    empty: 'Nothing here yet',
    drop_image_here: 'Drop images here',
  },

  navigation: {
    create_product: 'Create Product',
    orders: 'Orders',
    logout: 'Log out',
  },

  footer: {
    // footer_text: 'Made with \u2764 SPB 2018',
    footer_text: 'Made SPB 2018',
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
      grant_to_last_bidder: 'Grant to last bidder',
      goBack: 'Back',
    },

    comments_title: 'Comments',
    no_comments: 'No comments',

    last_bidder: 'Last bidder - {{bidder.username}}',
    sold_message: 'This item is sold',

    add_comment_button: 'Add comment',
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

  add_comment: {
    title: 'Add comment',
    form: {
      title: {
        label: 'Title',
      },
      body: {
        label: 'Body',
      },
    },
  },

  order_block: {
    title: 'Order from {{date}}',
  },
};
