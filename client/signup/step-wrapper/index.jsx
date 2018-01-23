/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import FormattedHeader from 'components/formatted-header';
import NavigationLink from 'signup/navigation-link';
import { isJetpackOAuth2Client } from 'lib/oauth2-clients';
import JetpackLogo from 'components/jetpack-logo';
import { getCurrentOAuth2Client } from 'state/ui/oauth2-clients/selectors';

class StepWrapper extends Component {
	static propTypes = {
		shouldHideNavButtons: PropTypes.bool,
		translate: PropTypes.func.isRequired,
		hideFormattedHeader: PropTypes.bool,
		hideBack: PropTypes.bool,
		hideSkip: PropTypes.bool,
		oauth2Client: PropTypes.object,
	};

	static defaultProps = {
		oauth2Client: null,
	};

	renderBack() {
		if ( this.props.shouldHideNavButtons ) {
			return null;
		}
		return (
			<NavigationLink
				direction="back"
				flowName={ this.props.flowName }
				positionInFlow={ this.props.positionInFlow }
				stepName={ this.props.stepName }
				stepSectionName={ this.props.stepSectionName }
				backUrl={ this.props.backUrl }
				signupProgress={ this.props.signupProgress }
				labelText={ this.props.backLabelText }
			/>
		);
	}

	renderSkip() {
		if ( ! this.props.shouldHideNavButtons && this.props.goToNextStep ) {
			return (
				<NavigationLink
					direction="forward"
					goToNextStep={ this.props.goToNextStep }
					defaultDependencies={ this.props.defaultDependencies }
					flowName={ this.props.flowName }
					stepName={ this.props.stepName }
					labelText={ this.props.skipLabelText }
				/>
			);
		}
	}

	headerText() {
		if ( this.props.positionInFlow === 0 ) {
			if ( this.props.headerText !== undefined ) {
				return this.props.headerText;
			}

			return this.props.translate( "Let's get started." );
		}

		if ( this.props.fallbackHeaderText !== undefined ) {
			return this.props.fallbackHeaderText;
		}
	}

	subHeaderText() {
		if ( this.props.positionInFlow === 0 ) {
			if ( this.props.subHeaderText !== undefined ) {
				return this.props.subHeaderText;
			}

			return this.props.translate( 'Welcome to the best place for your WordPress website.' );
		}

		if ( this.props.fallbackSubHeaderText !== undefined ) {
			return this.props.fallbackSubHeaderText;
		}
	}

	render() {
		const {
			stepContent,
			headerButton,
			hideFormattedHeader,
			hideBack,
			hideSkip,
			oauth2Client,
		} = this.props;
		const classes = classNames( 'step-wrapper', {
			'is-wide-layout': this.props.isWideLayout,
		} );

		return (
			<div className={ classes }>
				{ oauth2Client &&
					isJetpackOAuth2Client( oauth2Client ) && <JetpackLogo full size={ 72 } /> }
				{ ! hideFormattedHeader && (
					<FormattedHeader headerText={ this.headerText() } subHeaderText={ this.subHeaderText() }>
						{ headerButton }
					</FormattedHeader>
				) }

				<div className="step-wrapper__content is-animated-content">
					{ stepContent }

					<div className="step-wrapper__buttons">
						{ ! hideBack && this.renderBack() }
						{ ! hideSkip && this.renderSkip() }
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	state => ( {
		oauth2Client: getCurrentOAuth2Client( state ),
	} ),
	null
)( localize( StepWrapper ) );
