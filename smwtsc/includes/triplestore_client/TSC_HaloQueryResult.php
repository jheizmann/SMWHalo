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
 * @ingroup SMWHaloSMWDeviations
 *
 * Derived version of SMWQueryResult to provide user-defined link
 * to Special:Ask page. Necessary for other storages.
 *
 */

class SMWHaloQueryResult extends SMWQueryResult {
	
	// array of result subjects
	private $mResultSubjects;
	
	public function SMWHaloQueryResult($printrequests, $query, $results, $store, $furtherres=false) {
		parent::__construct($printrequests, $query, $results, $store, $furtherres);
		
		// retrieve result subjects for faster access
		$this->mResultSubjects = array();
		foreach($results as $r) {
			$first = reset($r);
            $rs = $first->getResultSubject();
			$this->mResultSubjects[] = $rs;
		}
	}
	    
	
	/**
	 * Setter method for the results.
	 * @param array(array(SMWHaloResultArray)) $results
	 * 		A table of results
	 */
	public function setResults($results) {
		$this->mResults = $results;
		$this->mResultSubjects = array();
		foreach($results as $r) {
			$first = reset($r);
			$rs = $first->getResultSubject();
			$this->mResultSubjects[] = $rs;
		}
	}
	
	public function getResults() {
		return $this->mResultSubjects;
	}
	
	public function getFullResults() {
		return $this->mResults;
	}
	
    /**
     * Return the next result row as an array of SMWResultArray objects, and
     * advance the internal pointer.
     */
    public function getNext() {
        $row = current($this->mResults);
    	next($this->mResults);
        if ($row === false) return false;
       
        return $row;
    }
    
    /**
     * Resets the internal array pointer of the result (rows) and all columns
     * within these rows.
     */
    public function resetResultArray() {
    	reset($this->mResults);
    	foreach ($this->mResults as $row) {
    		foreach ($row as $cell) {
    			$cell->resetContentArray();
    		}
    	}
    	reset($this->mResults);
    }
    
public function getQueryLink($caption = false) {

        $params = array(trim($this->mQuery->getQueryString()));
        foreach ($this->mQuery->getExtraPrintouts() as $printout) {
            $params[] = $printout->getSerialisation();
        }
        if ( count($this->mQuery->sortkeys)>0 ) {
            $psort  = '';
            $porder = '';
            $first = true;
            foreach ( $this->mQuery->sortkeys as $sortkey => $order ) {
                if ( $first ) {
                    $first = false;
                } else {
                    $psort  .= ',';
                    $porder .= ',';
                }
                $psort .= $sortkey;
                $porder .= $order;
            }
            if (($psort != '')||($porder != 'ASC')) { // do not mention default sort (main column, ascending)
                $params['sort'] = $psort;
                $params['order'] = $porder;
            }
        }
        if ($caption == false) {
            wfLoadExtensionMessages('SemanticMediaWiki');
            $caption = ' ' . wfMsgForContent('smw_iq_moreresults'); // the space is right here, not in the QPs!
        }
        
        // copy some LOD relevant parameters
        if (array_key_exists('dataspace', $this->mQuery->params)) {
            $params['dataspace'] = $this->mQuery->params['dataspace'];
        }
        if (array_key_exists('metadata', $this->mQuery->params)) {
            $params['metadata'] = $this->mQuery->params['metadata'];
        }
        if (array_key_exists('resultintegration', $this->mQuery->params)) {
            $params['resultintegration'] = $this->mQuery->params['resultintegration'];
        }
        if (array_key_exists('mainlabel', $this->mQuery->params)) {
            $params['mainlabel'] = $this->mQuery->params['mainlabel'];
        }
        if (array_key_exists('source', $this->mQuery->params)) {
            $params['source'] = $this->mQuery->params['source'];
        }
        // Note: the initial : prevents SMW from reparsing :: in the query string
        $result = SMWInfolink::newInternalLink($caption,':Special:Ask', false, $params);
        
        return $result;
    }
    
    
/*
     * Returns the Query Object 
     */
    public function getQuery(){
    	return $this->mQuery;
    }
    
}

/**
 * @ingroup SMWHaloSMWDeviations
 * 
 * Subclass is required to pre-set content for Halo result sets. 
 * They can not be loaded on demand. 
 * 
 * @author Kai K�hn
 *
 */
class SMWHaloResultArray extends SMWResultArray {
    public function SMWHaloResultArray(SMWDIWikiPage $resultpage, SMWPrintRequest $printrequest, SMWStore $store, $results) {
        parent::__construct($resultpage, $printrequest, $store);
        $this->mContent = $results; // do not reload
    }
    
    public function setContent($content) {
    	$this->mContent = $content;
    }
    
    /**
     * Resets the internal array pointer of the content.
     */
    public function resetContentArray() {
    	reset($this->mContent);
    }
    
    
}
