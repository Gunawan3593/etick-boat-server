import * as yup from 'yup';

yup.addMethod(yup.string, 'integer', function () {
    return this.matches(/^\d+$/, 'The field should have digits only')
});

const name = yup
    .string()
    .required('Name is required.')
    .min(3, 'Name should have atleast 3 characters.')
    .max(100, 'Name can have atmost 100 characters.');

const itno = yup
    .string()
    .required('In The name of is required.')
    .min(3, 'Name should have atleast 3 characters.')
    .max(100, 'Name can have atmost 100 characters.');

const account = yup
    .string()
    .integer()
    .required('Account number is required.')
    .min(10, 'Account number should have atleast 10 characters.');

export const NewBankValidationRules = yup.object().shape({
    name,
    itno,
    account
});