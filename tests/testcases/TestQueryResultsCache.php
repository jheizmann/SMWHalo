<?php

global $smwgHaloIP;
require_once( "$smwgHaloIP/includes/QueryResultsCache/SMW_QRC_Store.php" );

class TestQueryResultsCache extends PHPUnit_Framework_TestCase {

	private $dataArticle1 = "[[HasValue::1]] [[Category:DataArticle]]";
	private $dataArticle2 = '[[HasValue::2]] [[Category:DataArticle]]';
	private $dataArticle3 = '[[HasValue::3]] [[Category:AnotherDataArticle]]';
	
	private $queryArticle1 = '{{#ask: [[HasValue::+]] [[Category:DataArticle]] }} {{#ask: [[HasValue::+]] [[Category:AnotherDataArticle]] }}';
	private $queryArticle1Version2 = '{{#ask: [[HasValue::+]] [[Category:DataArticle]] }}';
	
	private $queryArticle2 = '{{#sparql: SELECT ?x WHERE { ?x prop:HasValue ?y .  ?x rdf:type cat:DataArticle . } }} {{#sparql: SELECT ?x WHERE { ?x prop:HasValue ?y .  ?x rdf:type cat:AnotherDataArticle . } }}';
	private $queryArticle2Version2 = '{{#sparql: SELECT ?x WHERE { ?x prop:HasValue ?y .  ?x rdf:type cat:DataArticle . } }}';
	
	function setup(){
		$articles = array($this->dataArticle1, $this->dataArticle2, $this->dataArticle3);
		$count = 0;
		foreach($articles as $article){
			$count++;
			smwf_om_EditArticle('QRCDataArticle'.$count, 'PHPUnit', $article, '');
		}
		
		$articles = array($this->queryArticle1, $this->queryArticle2);
		$count = 0;
		global $wgTitle;
		foreach($articles as $article){
			$count++;
			$wgTitle = Title::newFromText('QRCQueryArticle'.$count);
			smwf_om_DeleteArticle('QRCQueryArticle'.$count, 'PHPUnit', '');
		}
		
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		$qrcStore = SMWQRCStore::getInstance()->getDB();
		foreach($response->queryIds as $qId){
			$qrcStore->deleteQueryResult($qId);
		}
	}
	
	function testEmptyCacheBOTH(){
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		//first check whether the cache is empty
		$this->assertEquals(0, count($response->queryIds));
	}
	
	function testCacheEntriesAddedASK(){
		smwf_om_EditArticle('QRCQueryArticle1', 'PHPUnit', $this->queryArticle1, '');
		
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		//check whether two new cache entries have been added
		$this->assertEquals(2, count($response->queryIds));
		
		$qrcStore = SMWQRCStore::getInstance()->getDB();
		$resultCount = 2; //todo: this is ugly
		foreach($response->queryIds as $qId){
			$queryResult = $qrcStore->getQueryResult($qId);
			$queryResult = unserialize($queryResult);
			
			//check whether unserialize works like expected
			$unserializedCorrectly = ($queryResult instanceof SMWQueryResult) ? true : false;
			$this->assertEquals(true, $unserializedCorrectly);
			
			//check number of retrieved results
			$this->assertEquals($resultCount, count($queryResult->getResults()));
			$resultCount--;
		}
	}
	
	function testCacheEntriesAddedSPARQL(){
		smwf_om_EditArticle('QRCQueryArticle2', 'PHPUnit', $this->queryArticle1, '');
		
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		//check whether two new cache entries have been added
		$this->assertEquals(2, count($response->queryIds));
		
		$qrcStore = SMWQRCStore::getInstance()->getDB();
		$resultCount = 2; //todo: this is ugly
		foreach($response->queryIds as $qId){
			$queryResult = $qrcStore->getQueryResult($qId);
			$queryResult = unserialize($queryResult);
			
			//check whether unserialize works like expected
			$unserializedCorrectly = ($queryResult instanceof SMWQueryResult) ? true : false;
			$this->assertEquals(true, $unserializedCorrectly);
			
			//check number of retrieved results
			$this->assertEquals($resultCount, count($queryResult->getResults()));
			$resultCount--;
		}
	}
	
	public function testDeleteCacheEntryBOTH(){
		smwf_om_EditArticle('QRCQueryArticle1', 'PHPUnit', $this->queryArticle1, '');
		smwf_om_EditArticle('QRCQueryArticle1', 'PHPUnit', $this->queryArticle1Version2, '');
		smwf_om_EditArticle('QRCQueryArticle2', 'PHPUnit', $this->queryArticle2, '');
		smwf_om_EditArticle('QRCQueryArticle2', 'PHPUnit', $this->queryArticle2Version2, '');
		
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		foreach($response->queryIds as $qId){
			$request = json_encode(array('debug' => true, 'queryId' => $qId));
			$response = smwf_qc_updateQuery($request);
			$response = json_decode($response);
			
			$this->assertEquals(true, $response->success);
		}
		
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		$this->assertEquals(2, count($response->queryIds));
	}
	
	public function testCacheEntryUsedASK(){
		smwf_om_EditArticle('QRCQueryArticle1', 'PHPUnit', $this->queryArticle1, '');
		
		smwf_om_DeleteArticle('QRCDataArticle1', 'PHPUnit', '');
		
		$article = Article::newFromID(Title::newFromText('QRCQueryArticle1')->getArticleID());
		$content = $article->getContent();
		
		global $wgParser;
		$pOpts = new ParserOptions();
		$result = $wgParser->parse($content, Title::newFromText('QRCQueryArticle1'), $pOpts)->getText();
		
		$cacheEntryUsed = false;
		if(strpos($result, 'QRCDataArticle1') > 0) $cacheEntryUsed = true;
		$this->assertEquals(true, $cacheEntryUsed);
		
	}
	
	public function testCacheEntryUsedSPARQL(){
		smwf_om_EditArticle('QRCQueryArticle2', 'PHPUnit', $this->queryArticle2, '');
		
		smwf_om_DeleteArticle('QRCDataArticle1', 'PHPUnit', '');
		
		$article = Article::newFromID(Title::newFromText('QRCQueryArticle2')->getArticleID());
		$content = $article->getContent();
		
		global $wgParser;
		$pOpts = new ParserOptions();
		$result = $wgParser->parse($content, Title::newFromText('QRCQueryArticle1'), $pOpts)->getText();
		
		$cacheEntryUsed = false;
		if(strpos($result, 'QRCDataArticle1') > 0) $cacheEntryUsed = true;
		$this->assertEquals(true, $cacheEntryUsed);
		
	}
	
	public function testCacheEntryNotUsedASK(){
		smwf_om_EditArticle('QRCQueryArticle1', 'PHPUnit', $this->queryArticle1, '');
		
		smwf_om_DeleteArticle('QRCDataArticle1', 'PHPUnit', '');
		
		$article = Article::newFromID(Title::newFromText('QRCQueryArticle1')->getArticleID());
		$content = $article->getContent();
		
		global $wgRequest;
		$wgRequest->setVal('action', 'purge');
		
		global $wgParser;
		$pOpts = new ParserOptions();
		$result = $wgParser->parse($content, Title::newFromText('QRCQueryArticle1'), $pOpts)->getText();
		
		$article = Article::newFromID(Title::newFromText(QRCQueryArticle1));
		
		$cacheEntryUsed = false;
		if(strpos($result, 'QRCDataArticle1') > 0) $cacheEntryUsed = true;
		$this->assertEquals(false, $cacheEntryUsed);
	}
	
	public function testCacheEntryNotUsedSPARQL(){
		smwf_om_EditArticle('QRCQueryArticle2', 'PHPUnit', $this->queryArticle2, '');
		
		smwf_om_DeleteArticle('QRCDataArticle1', 'PHPUnit', '');
		
		$article = Article::newFromID(Title::newFromText('QRCQueryArticle2')->getArticleID());
		$content = $article->getContent();
		
		global $wgRequest;
		$wgRequest->setVal('action', 'purge');
		
		global $wgParser;
		$pOpts = new ParserOptions();
		$result = $wgParser->parse($content, Title::newFromText('QRCQueryArticle2'), $pOpts)->getText();
		
		$article = Article::newFromID(Title::newFromText(QRCQueryArticle2));
		
		$cacheEntryUsed = false;
		if(strpos($result, 'QRCDataArticle1') > 0) $cacheEntryUsed = true;
		$this->assertEquals(false, $cacheEntryUsed);
	}
	
	public function testArticleUpdatedByAPIBOTH(){
		smwf_om_EditArticle('QRCQueryArticle1', 'PHPUnit', $this->queryArticle1, '');
		
		smwf_om_DeleteArticle('QRCDataArticle1', 'PHPUnit', '');
		
		$request = json_encode(array('debug' => true));
		$response = smwf_qc_getQueryIds($request);
		$response = json_decode($response);
		
		foreach($response->queryIds as $qId){
			$request = json_encode(array('debug' => true, 'queryId' => $qId));
			$response = smwf_qc_updateQuery($request);
			$response = json_decode($response);
		}

		global $wgOut; 
		$wgOut = new OutputPage();;
		
		$article = new Article(Title::newFromText('QRCQueryArticle1'));
		$article->view();
		
		$html = print_r($wgOut->getHTML(), true); 
		$found = false;
		if(strpos($html, 'QRCDataArticle1') > 0) $found = true;
		
		$this->assertEquals(false, $found);
	}
}