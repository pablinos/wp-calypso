/** @format */
/**
 * External dependencies
 */
import React from 'react';

import createReactClass from 'create-react-class';
import { bindActionCreators } from 'redux';

import { localize } from 'i18n-calypso';
import { flow } from 'lodash';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import analyticsMixin from 'lib/mixins/analytics';
import Card from 'components/card/compact';
import Header from './card/header';
import Property from './card/property';
import VerticalNav from 'components/vertical-nav';
import VerticalNavItem from 'components/vertical-nav/item';

import { getSelectedSiteId } from 'state/ui/selectors';
import { requestSiteRename } from 'state/site-rename/actions';

// Currently the changes here are just for conveniently testing the call & state changes.
// More specific UI changes to come.

const WpcomDomain = createReactClass( {
	displayName: 'WpcomDomain',
	mixins: [ analyticsMixin( 'domainManagement', 'edit' ) ],

	handleEditSiteAddressClick() {
		this.recordEvent( 'navigationClick', 'Edit Site Address', this.props.domain );

		const { siteId } = this.props;
		const newBlogName = 'spentaylor';
		const discard = false;

		this.props.requestSiteRename( siteId, newBlogName, discard );
	},

	getEditSiteAddressBlock() {
		/**
		 * Hide Edit site address for .blog subdomains as this is unsupported for now.
		 */
		if ( this.props.domain.name.match( /\.\w+\.blog$/ ) ) {
			return null;
		}

		return (
			<VerticalNav>
				<VerticalNavItem
					xpath={ `https://${ this.props.domain.name }/wp-admin/index.php?page=my-blogs#blog_row_${
						this.props.selectedSite.ID
					}` }
					xexternal={ true }
					onClick={ this.handleEditSiteAddressClick }
				>
					{ this.props.translate( 'Edit Site Address' ) }
				</VerticalNavItem>
			</VerticalNav>
		);
	},

	render() {
		return (
			<div>
				<div className="domain-details-card">
					<Header { ...this.props } />

					<Card>
						<Property label={ this.props.translate( 'Type', { context: 'A type of domain.' } ) }>
							{ this.props.translate( 'Included with Site' ) }
						</Property>

						<Property
							label={ this.props.translate( 'Renews on', {
								comment:
									'The corresponding date is in a different cell in the UI, the date is not included within the translated string',
							} ) }
						>
							<em>{ this.props.translate( 'Never Expires' ) }</em>
						</Property>
					</Card>
				</div>
				{ this.getEditSiteAddressBlock() }
			</div>
		);
	},
} );

export default flow(
	localize,
	connect(
		state => ( {
			siteId: getSelectedSiteId( state ),
		} ),
		dispatch => (
				bindActionCreators(
				{
					requestSiteRename,
				},
				dispatch
			)
		)
	 )
)( WpcomDomain );

// export default localize( WpcomDomain );
