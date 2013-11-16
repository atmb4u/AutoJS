/*!
* Copyright (c) 2013 Profoundis Labs Pvt. Ltd., and individual contributors.
* 
* All rights reserved.
*/
/* 
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
* 
*     1. Redistributions of source code must retain the above copyright notice,
*        this list of conditions and the following disclaimer.
* 
*     2. Redistributions in binary form must reproduce the above copyright
*        notice, this list of conditions and the following disclaimer in the
*        documentation and/or other materials provided with the distribution.
* 
*     3. Neither the name of autojs nor the names of its contributors may be used
*        to endorse or promote products derived from this software without
*        specific prior written permission.
* 
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
* ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* 
* reuses a lot of code from Nicholas C. Zakas textfield autocomplete example found here
* http://oak.cs.ucla.edu/cs144/projects/javascript/suggest1.html
*     
*/

/*
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
function AutoSuggestControl(element_id /*:HTMLInputElement*/) {
    this.provider /*:SuggestionProvider*/ = new wordSuggestions();
    /**
     * The textbox to capture, specified by element_id.
     * @scope private
     */
    this.textbox /*:HTMLInputElement*/ = document.getElementById(element_id);
    
    //initialize the control
    this.init();
    
}


/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 */
AutoSuggestControl.prototype.autosuggest = function (aSuggestions /*:Array*/) {
    
    //make sure there's at least one suggestion

    if (aSuggestions.length > 0) {
            this.typeAhead(aSuggestions[0]);
    }
};


/**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {

    var iKeyCode = oEvent.keyCode;

    //make sure not to interfere with non-character keys
    if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
        //ignore
    } else {
        //request suggestions from the suggestion provider
        this.provider.requestSuggestions(this);
    }
};

/**
 * Initializes the textarea with event handlers for
 * auto suggest functionality.
 * @scope private
 */
AutoSuggestControl.prototype.init = function () {

    //save a reference to this object
    var oThis = this;
    
    //assign the onkeyup event handler
    this.textbox.onkeyup = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        
        //call the handleKeyUp() method with the event object
        oThis.handleKeyUp(oEvent);
    };
    
};

/**
 * Selects a range of text in the textarea.
 * @scope public
 * @param iStart The start index (base 0) of the selection.
 * @param iLength The number of characters to select.
 */
AutoSuggestControl.prototype.selectRange = function (iStart /*:int*/, iLength /*:int*/) {
    //use text ranges for Internet Explorer
    if (this.textbox.createTextRange) {
        var oRange = this.textbox.createTextRange(); 
        oRange.moveStart("character", iStart); 
        oRange.moveEnd("character", iLength);      
        oRange.select();
        
    //use setSelectionRange() for Mozilla
    } else if (this.textbox.setSelectionRange) {
        this.textbox.setSelectionRange(iStart, iLength);
    }     

    //set focus back to the textbox
    this.textbox.focus();
}; 

/**
 * Inserts a suggestion into the textbox, highlighting the 
 * suggested part of the text.
 * @scope private
 * @param sSuggestion The suggestion for the textbox.
 */
AutoSuggestControl.prototype.typeAhead = function (sSuggestion /*:String*/) {

    //check for support of typeahead functionality
    if (this.textbox.createTextRange || this.textbox.setSelectionRange){
        var lastSpace = this.textbox.value.lastIndexOf(" ");
        var lastEnter = this.textbox.value.lastIndexOf("\n");
        var lastIndex = Math.max(lastSpace, lastEnter) + 1;
        var contentStripped = this.textbox.value.substring(0, lastIndex);
        var lastWord = this.textbox.value.substring(lastIndex, this.textbox.value.length);
        this.textbox.value = contentStripped + sSuggestion; //.replace(lastWord,""); 
        var start = this.textbox.value.length - sSuggestion.replace(lastWord,"").length; 
        var end = this.textbox.value.length; 
        this.selectRange(start, end);
    }
};



/**
 * Request suggestions for the given autosuggest control. 
 * @scope protected
 * @param oAutoSuggestControl The autosuggest control to provide suggestions for.
 */
wordSuggestions.prototype.requestSuggestions = function (oAutoSuggestControl /*:AutoSuggestControl*/) {
    var aSuggestions = [];
    var sTextbox = oAutoSuggestControl.textbox.value;
    var sTextboxSplit = sTextbox.split(/\W+/);
    var sTextboxLast = sTextboxSplit[sTextboxSplit.length-1];
    var sTextboxValue = sTextboxLast;
    if (sTextboxValue.length > 0){
        //search for matching words
        for (var i=0; i < this.words.length; i++) { 
            if (this.words[i].indexOf(sTextboxValue.toLowerCase()) == 0) {
                if (this.words[i].indexOf(sTextboxValue) == 0){
                    aSuggestions.push(this.words[i]);
                }
                else if (this.words[i].indexOf(sTextboxValue.charAt(0).toLowerCase() + sTextboxValue.slice(1)) == 0) {
                    aSuggestions.push(this.words[i].charAt(0).toUpperCase() + this.words[i].slice(1));
                }
            } 
        }
    }

    //provide suggestions to the control
    oAutoSuggestControl.autosuggest(aSuggestions);
};
/**
 * Provides suggestions for each word.
 * @class
 * @scope public
 */
function wordSuggestions() {
    this.words = ['the','and','that','for','with','yo','are','your','from','have','more','but','new','not','will','what','about','all','one','they','get','like','out','their','who','people','been','can','how','there','which','were','apple','time','when','just','into','said','our','here','also','year','view','these','comment','had','would','other','now','than','she','see','after','most','some','make','points','her','mobile','day','insider','point','company','over','twitter','use','right','say','could','them','way','first','why','ago','world','thing','only','login','even','before','because','any','two','million','please','device','service','phone','made','topic','while','best','work','last','know','network','read','him','much','want','those','where','follow','user','friend','may','then','going','still','well','look','being','post','think','photo','hour','many','take','image','back','got','video','should','off','very','site','come','good','recently','need','down','did','show','email','open','around','really','week','policy','using','through','big','today','game','alert','article','stock','too','media','next','product','find','android','own','during','free','market','story','lot','reading','term','social','feel','technology','share','every','able','shared','since','question','life','state','inc','home','few','told','never','president','data','something','job','house','report','used','better','another','window','city','according','content','system','via','part','government','same','help','man','let','both','disrupt','privacy','top','software','tech','number','percent','long','each','such','inside','car','line','month','three','actually','doe','live','end','money','might','billion','without','experience','little','found','future','great','school','put','information','between','already','must','case','quote','feature','though','ever','page','plan','including','tags','call','called','making','police','copyright','web','mean','change','password','seem','white','serving','powered','ask','reserved','idea','logged','tell','against','problem','give','working','learn','full','startup','continue','doing','team','acceptance','constitute','forgot','national','set','tablet','run','consumer','fact','yet','love','different','name','far','cant','women','registration','place','least','disclaimer','sale','directly','become','getting','real','update','party','play','advertising','writer','high','group','turn','keep','public','enough','ready','second','republican','health','everyone','once','away','pay','under','years','browser','five','past','buy','deal','old','left','store','former','small','early','computer','law','based','guy','looking','bad','office','covered','price','design','kind','bit','support','offer','search','note','person','start','likely','advertise','reason','guest','having','sure','took','hardware','per','screen','bill','respect','blog','space','taking','probably','platform','war','key','john','power','again','someone','seen','later','men','watch','family','hand','important','website','employee','version','however','care','believe','pretty','marketing','went','issue','official','trying','until','started','night','course','china','alway','intelligence','add','guideline','customer','instead','everything','security','current','building','asked','sign','anonymity','brand','hard','whether','country','coming','digital','revenue','manually','mac','scoop','amazon','wont','examples','gun','strong','four','hit','include','thought','latest','submitting','review','huge','launch','order','student','available','following','word','markup','coded','pro','especially','death','done','children','style','maybe','daily','credit','camera','talk','kid','control','below','among','came','example','event','blackberry','street','cost','fire','woman','picture','yahoo','industry','model','developer','black','running','source','anything','together','simply','major','this','commerce','book','allow','quarter','growth','behind','biggest','member','pap','business','chart','move','provide','court','face','almost','tax','stop','music','create','given','several','recent','university','project','map','display','lead','head','try','air','popular','thank','young','result','known','gay','program','account','side','invest','cut','star','wanted','release','images','possible','list','act','college','anyone','history','often','earlier','link','focused','sheet','saw','shot','clear','either','worked','message','area','dead','center','human','build','six','movie','north','saying','true','whole','itself','along','morning','happen','operating','announced','local','released','sex','campaign','worth','sound','sell','interview','taken','bring','rather','reported','park','galaxy','news','code','minute','food','devices','ability','record','tool','half','require','age','research','nothing','mark','final','meet','claim','girl','currently','attack','win','finally','statement','march','consider','couple','check','nearly','light','investor','wrong','mini','says','parent','military','within','reporter','conference','august','led','room','study','broker','personal','text','leave','large','easy','wrote','level','posted','lost','due','single','hope','value','art','drive','founder','covering','force','third','fan','offering','department','capital','test','remain','cover','general','fox','partner','else','published','front','moment','close','outside','united','executive','appear','wall','hold','matter','seconds','sense','sold','stand','mind','soon','moving','simple','forward','federal','water','killed','body','leader','secret','senate','democratic','global','expect','near','original','similar','film','player','board','private','fast','financial','action','became','red','beyond','potential','exactly','science','talking','worker','development','send','quickly','editor','quite','himself','entire','eye','shooting','late','spent','drug','answer','yes','short','desktop','sandy','added','charge','total','explain','smart','responsible','international','step','form','cloud','type','director','low','dollar','created','companies','trial','expected','track','startups','built','mother','users','ill','medical','doctor','decision','piece','officer','application','surface','completely','community','annual','redirected','cash','amount','longer','spending','silicon','interesting','vote','die','boy','write','effect','detail','arm','rate','enterprise','award','spend','stuff','dad','largest','turned','server','bar','mitt','lie','sort','above','launched','began','save','child','chief','increase','suspect','dog','marathon','hot','although','stay','growing','fall','visual','political','race','option','heard','sent','chance','super','electronic','location','worst','retail','analyst','response','effort','copy','thousand','road','firm','gave','strategy','laptop','date','communication','figure','despite','prior','previously','died','owner','evidence','debate','newsletter','sometime','fun','rest','tap','south','average','times','tip','happened','break','amazing','rule','speak','common','lab','paid','understand','solution','yourself','battery','risk','bottom','town','presidential','interest','individual','favorite','jay','cat','designed','tried','raised','heart','son','economy','remember','guide','toward','sport','performance','won','position','starting','rap','carrier','fund','meeting','click','decided','photos','wait','giving','gone','writing','sept','scene','further','debt','massive','living','relationship','agency','fix','management','nice','staff','thinking','god','special','perfect','traffic','written','author','return','box','sit','sites','received','victim','updated','hundred','expensive','hate','inch','knew','powerful','mile','size','met','weekend','raise','paper','multiple','tweet','standard','cup','touch','marriage','leading','buying','eat','certain','attention','letter','external','legal','choice','crazy','middle','reader','driver','playing','oil','successful','east','whose','selling','shutdown','reveal','senior','ten','pad','services','maker','rich','changed','television','weapon','season','cable','hear','suggest','candidate','specific','kill','higher','west','iii','role','cool','valley','lap','expert','addition','looked','range','clearly','viewed','focus','energy','culture','happy','enabled','speech','file','voice','nation','learned','investment','gaming','lee','fit','mom','cause','felt','restaurant','opportunity','card','pop','reach','months','budget','driving','certainly','politic','lad','hosted','round','challenge','unit','martin','eventually','log','div','hospital','venture','wed','compared','machine','trend','mayer','door','defense','hey','wife','sad','rep','begin','sea','poll','decade','overall','ton','held','conservative','earning','enabling','stage','upon','needed','square','pie','rim','pep','period','download','baby','feed','profile','whatever','demand','target','things','par','election','tea','sharing','funding','ahead','ban','mostly','goal','payment','walk','involved','japan','attempt','rise','patient','benefit','audience','lower','features','request','provided','reportedly','quality','father','pick','fee','reports','net','fight','jobs','products','asking','immediately','giant','ground','holding','speaker','friends','alone','song','mph','hell','generation','present','fiscal','ran','changing','significant','apparently','seeing','production','grow','additional','upgrading','revealed','calling','journal','situation','sen','showing','hub','education','senator','patent','games','crime','related','officially','brought','earth','joining','days','networking','bought','document','administration','bank','visit','yesterday','drop','island','bowl','bush','speed','contact','reality','awesome','difference','summer','journalist','associated','difficult','pat','prison','inspired','played','color','watching','myself','magazine','cook','weight','paste','explained','included','majority','physical','advantage','bin','sleep','computing','helped','beat','convention','killing','embed','complete','career','allowed','rip','highly','arrested','basic','approach','oracle','kindle','ecosystem','named','bigger','noted','base','definitely','match','ended','button','character','economic','training','beautiful','judge','function','pin','researcher','democrat','gap','nor','shit','fine','interested','trip','smaller','leaving','instance','justice','charged','etc','profit','loading','active','delivered','pet','title','pit','corporate','bid','handset','located','main','condition','brain','lose','worse','becoming','surveillance','onto','practice','hearing','coverage','connected','sum','connection','manager','showed','continued','was','imagine','murder','totally','particular','block','concept','ship','green','era','mar','creating','paying','conversation','aid','purchase','holiday','impact','professional','spy','reporting','receive','aim','actual','football','deliver','bunch','gadget','push','scientist','advice','basically','easily','cancer','amp','bet','host','produce','count','foreign','seemed','brother','pope','radio','arrive','king','entirely','normal','meanwhile','bag','fear','newspaper','skill','fat','phones','investigation','exchange','identity','limited','travel','founded','truth','sponsored','larger','storage','dozen','measure','rob','knowledge','innovation','speaking','bay','mistake','discussion','deep','operation','peter','brief','easier','poor','telling','waiting','systems','prove','surprise','threat','army','clean','beginning','station','field','seven','reached','gold','competition','fed','putting','core','hook','lack','resident','chip','table','keyboard','winner','attorney','alternative','required','fair','meant','aha','confirmed','animal','egg','sun','advertiser','committee','ram','alp','club','blood','traditional','material','shut','bpi','truly','particularly','bob','unique','words','northern','issues','finding','mike','church','hip','possibly','mix','serve','bed','safe','willing','engine','strike','avoid','eight','pew','pea','activity','plenty','thoughts','language','organization','factor','sorry','tiny','channel','income','direct','baa','acquisition','wonder','joke','ppr','est','battle','designer','cap','adding','scale','path','joy','feeling','gift','cliff','ice','insurance','offered','dark','ppm','trouble','river','tag','choose','quick','flight','impressive','pull','others','exploding','subject','cell','pee','join','specifically','failed','hill','episode','generally','none','protect','older','pen','words','lip','brown','indeed','worldwide','engineer','teen','disaster','teacher','moved','usually','opened','pal','pry','odd','distribution','ray','pair','nap','daughter','learning','keeping','pressure','manufacturer','providing','leg','chi','rock','losing','broke','woe','fired','described','behavior','surprising','cab','missing','straight','collection','forget','caught','agree','aka','alt','console','cannot','spot','describe','rat','dip','modern','husband','tablets','concern','returned','rape','damage','feet','tom','rose','extra','dab','pup','useful','seriously','eating','absolutely','hat','lit','walking','county','bah','mad','virtual','enter','professor'];
}