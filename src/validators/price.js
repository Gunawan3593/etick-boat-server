import * as yup from 'yup';

const name = yup
    .string()
    .required('Name is required.')
    .min(3, 'Name should have atleast 3 characters.')
    .max(100, 'Name can have atmost 100 characters.');

const unit = yup
    .string()
    .required('Unit is required.')

const vendor = yup
    .string()
    .required('Vendor is required.')

const routeFrom = yup
    .string()
    .required('Route from is required.')

const routeTo = yup
    .string()
    .required('Route to is required.')

export const NewPriceValidationRules = yup.object().shape({
    name,
    unit,
    routeFrom,
    routeTo,
    vendor
});