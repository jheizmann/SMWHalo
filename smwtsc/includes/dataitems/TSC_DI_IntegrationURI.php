<?php
/*
 * Copyright (C) Vulcan Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program.If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @file
 * @ingroup SMWDataItems
 */

/**
 * This class implements URI data items.
 *
 * @since 1.6
 *
 * @author Markus Krötzsch
 * @ingroup SMWDataItems
 */
class SMWDIIntegrationUri extends SMWDataItem {
    const TYPE_INTEGRATIONURI     = 101;
	/**
	 * URI scheme such as "html" or "mailto".
	 * @var string
	 */
	protected $m_scheme;
	/**
	 * "Hierpart" of the URI (usually some authority and path).
	 * @var string
	 */
	protected $m_hierpart;
	/**
	 * Query part of the URI.
	 * @var string
	 */
	protected $m_query;
	/**
	 * Fragment part of the URI.
	 * @var string
	 */
	protected $m_fragment;

	/**
	 * Initialise a URI by providing its scheme (e.g. "html"), 'hierpart'
	 * following "scheme:" (e.g. "//username@example.org/path), query (e.g.
	 * "q=Search+term", and fragment (e.g. "section-one"). The complete URI
	 * with these examples would be
	 * http://username@example.org/path?q=Search+term#section-one
	 * @param $scheme string for the scheme
	 * @param $hierpart string for the "hierpart"
	 * @param $query string for the query
	 * @param $fragment string for the fragment
	 *
	 * @todo Implement more validation here.
	 */
	public function __construct( $scheme, $hierpart, $query, $fragment ) {
		if ( ( $scheme == '' ) || ( preg_match( '/[^a-zA-Z]/u', $scheme ) ) ) {
			throw new SMWDataItemException( "Illegal URI scheme \"$scheme\"." );
		}
		if ( $hierpart == '' ) {
			throw new SMWDataItemException( "Illegal URI hierpart \"$hierpart\"." );
		}
		$this->m_scheme   = $scheme;
		$this->m_hierpart = $hierpart;
		$this->m_query    = $query;
		$this->m_fragment = $fragment;
	}

	public function getDIType() {
		return SMWDIIntegrationUri::TYPE_INTEGRATIONURI;
	}

	/// @todo This should be changed to the spelling getUri().
	public function getURI() {
		return $this->m_scheme . ':' . $this->m_hierpart .
			( $this->m_query ? '?' . $this->m_query : '' ) . 
			( $this->m_fragment ? '#' . $this->m_fragment : '' );
	}

	public function getScheme() {
		return $this->m_scheme;
	}

	public function getHierpart() {
		return $this->m_hierpart;
	}

	public function getQuery() {
		return $this->m_query;
	}

	public function getFragment() {
		return $this->m_fragment;
	}

	public function getSortKey() {
		return $this->getURI();
	}

	public function getSerialization() {
		return $this->getURI();
	}

	/**
	 * Create a data item from the provided serialization string and type
	 * ID.
	 * @return SMWDIUri
	 */
	public static function doUnserialize( $serialization ) {
		$parts = explode( ':', $serialization, 2 ); // try to split "schema:rest"
		if ( count( $parts ) <= 1 ) {
			throw new SMWDataItemException( "Unserialization failed: the string \"$serialization\" is no valid URI." );
		}
		$scheme = $parts[0];
		$parts = explode( '?', $parts[1], 2 ); // try to split "hier-part?queryfrag"
		if ( count( $parts ) == 2 ) {
			$hierpart = $parts[0];
			$parts = explode( '#', $parts[1], 2 ); // try to split "query#frag"
			$query = $parts[0];
			$fragment = ( count( $parts ) == 2 ) ? $parts[1] : '';
		} else {
			$query = '';
			$parts = explode( '#', $parts[0], 2 ); // try to split "hier-part#frag"
			$hierpart = $parts[0];
			$fragment = ( count( $parts ) == 2 ) ? $parts[1] : '';
		}
		return new SMWDIIntegrationUri( $scheme, $hierpart, $query, $fragment );
	}

}
