'use strict';
import isUndef from '../../../utils/utils';
export var checkLimit = limit => (isUndef(limit) || limit > 100) ? 100 : limit;
