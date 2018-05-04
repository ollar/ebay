import { helper } from '@ember/component/helper';
import format from 'npm:date-fns/format';

export function formatDate(params /*hash*/) {
    return format(params[0], params[1]);
}

export default helper(formatDate);
