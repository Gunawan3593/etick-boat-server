import * as yup from 'yup';

const name = yup
    .string()
    .required('Name of the post is required.')
    .min(3, 'Name should have atleast 3 characters.')
    .max(100, 'Name can have atmost 100 characters.');

const descriptions = yup
    .string()
    .required('Descriptions of the post is required.')
    .min(10, 'Descriptions should have atleast 10 characters.');

export const NewRouteValidationRules = yup.object().shape({
    name,
    descriptions
});