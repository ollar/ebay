import { helper } from '@ember/component/helper';

export function price(params /*, hash*/) {
    return `${params} \u20bd`;
}

export default helper(price);
