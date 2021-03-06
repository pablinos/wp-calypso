/**
 * Extrenal dependencies
 *
 * @format
 */

import React, { Component } from 'react';
import validatorFactory from 'is-my-json-valid';
import { castArray, get, isEmpty, map, reduce, replace, set } from 'lodash';
import debugFactory from 'debug';
const debug = debugFactory( 'calypso:domains:with-contact-details-validation' );

/**
 * Internal dependencies
 */

export function disableSubmitButton( children ) {
	if ( isEmpty( children ) ) {
		return children;
	}

	return map( castArray( children ), ( child, index ) =>
		React.cloneElement( child, {
			disabled: !! child.props.className.match( /submit-button/ ) || child.props.disabled,
			key: index,
		} )
	);
}

export function interpretIMJVError( error, schema ) {
	let explicitPath, errorCode;

	if ( schema ) {
		// Search up the schema for an explicit errorField & message
		const path = [ ...castArray( error.schemaPath ) ];

		do {
			const node = get( schema, path, {} );
			errorCode = errorCode || node.errorCode;
			explicitPath = explicitPath || node.errorField;
		} while ( path.pop() && ! ( explicitPath && errorCode ) );
	}

	// use field from error
	const inferredPath = replace( error.field, /^data\./, '' );

	return {
		errorCode: errorCode || error.message,
		path: explicitPath || inferredPath,
	};
}

/*
 * @returns errors by field, like: { 'extra.field: name, errors: [ string ] }
 */
export function formatIMJVErrors( errors, schema ) {
	return reduce(
		errors,
		( accumulatedErrors, error ) => {
			// scan for errorField and errorCode at or above the failed rule
			const details = interpretIMJVError( error, schema );

			const { path, errorCode } = details;

			// TODO: get localize user facing strings
			const message = errorCode;

			const previousErrorsForField = get( accumulatedErrors, path, [] );

			return set( accumulatedErrors, path, [ ...previousErrorsForField, message ] );
		},
		{}
	);
}

const WithContactDetailsValidation = ( schema, WrappedComponent ) => {
	return class FormWithValidation extends Component {
		validate = validatorFactory( schema, { greedy: true, verbose: true } );

		validateContactDetails() {
			const isValid = this.validate( this.props.contactDetails );

			if ( isValid ) {
				debug( 'data is valid' );
				return {};
			}

			// TODO: error codes => localized strings
			const result = formatIMJVErrors( this.validate.errors, schema );

			return result;
		}

		render() {
			return (
				<WrappedComponent { ...this.props } validationErrors={ this.validateContactDetails() } />
			);
		}
	};
};

export default WithContactDetailsValidation;
