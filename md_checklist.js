var checklist_elements = {};

var pagetitle="markdeep-checklist-blank";

function add_reset_button(ul, toc)
{    
    var child_elts = ul.children;      
    for(let elt of child_elts)
    {
        
        if(elt.classList.contains("unchecked"))
        {
            var name =  toc + "-" + elt.innerHTML;                                
            elt.setAttribute("toc", toc);
            elt.setAttribute("checklist_name", name);
        }
    }
}


function reset_checklist(toc)
{
    var check_items = document.getElementsByClassName("unchecked");    
    // clear all items with this tagged group index
    for(let elt of check_items)
    {             
            var elt_toc = elt.getAttribute("toc");
            if(elt_toc && elt_toc.startsWith(toc))
            {
                set_checklist(elt, false);
            }
    }
}

function add_reset()
{
    var ix = 0;    
    // find anchors with a name like "toc1.1.2"
    var anchors = document.getElementsByTagName("a");

    for(let element of anchors)
    {    
        
        var name = element.getAttribute("name");
        if(element.classList.contains("target") && name.startsWith("toc"))
            {                
                var toc = name;
                // search subsequent elements
                var p_element = element.nextSibling;
                var attached = false;
                while(p_element!=null)
                {
                    // add button to next header element                
                    if(p_element.tagName && p_element.tagName.startsWith("H") && !attached)
                    {
                        var toc_name = "'" + toc + "'";
                        p_element.innerHTML = '<button onclick="reset_checklist('+toc_name+')" class="clear-button"> Reset </button> '  + p_element.innerHTML;
                        attached = true;
                    }
                    // add reset tag to this element
                    if(p_element.tagName=='UL')
                    {
                        add_reset_button(p_element, toc);
                    }
                    p_element = p_element.nextSibling;
                }
            }        
    }
}


function reset_all()
{
    var check_items = document.getElementsByClassName("unchecked");
    checklist_elements = {};
    // clear all items with this tagged group index
    for(let elt of check_items)
    {             
            set_checklist(elt, false);
    }
}

function reset_list(index)
{
    var check_items = document.getElementsByClassName("unchecked");
    // clear all items with this tagged group index
    for(let elt of check_items)
    {        
        if(elt.getAttribute("clear_index")==index)
            set_checklist(elt, false);
    }
}

// return true if element is currently checked
function get_checklist(element)
{
    var state;
    state = element.classList.contains("swipe-check");
    return state;
}

// set the given element to be checked
// and record this in local storage
function set_checklist(element, state)
{
    var chk_name = element.getAttribute("checklist_name");

    if(state)
    {
        element.classList.add("swipe-check");
        element.classList.remove("swipe-uncheck");                                       
        checklist_elements[chk_name] = true;
    }
    else
    {
        element.classList.add("swipe-uncheck");
        element.classList.remove("swipe-check");        
        checklist_elements[chk_name] = undefined;
    }
    window.localStorage.setItem(pagetitle, JSON.stringify(checklist_elements));
}


function make_checks()
    {        
        var check_items = document.getElementsByClassName("unchecked");        
        
        var title_elt = document.getElementsByClassName("title");    
        if(title_elt && title_elt[0])
            page_title = "markdeep-checklist-"+title_elt[0].innerHTML;
    
        
        add_reset();
        // restore previous state
        checklist_elements = JSON.parse(window.localStorage.getItem(pagetitle));

        for(let element of check_items)
        {
            var chk_name = element.getAttribute("checklist_name");
            if(checklist_elements[chk_name]===true)
                set_checklist(element, true);         
            
            function attach_listener(element)
            {
                var onlongtouch; 
                var timer;
                var touchduration = 600; 

                // set on touch
                var touchstart = function(e) {         
                    e.preventDefault();
                    set_checklist(element, true);
                    if (!timer) {
                        timer = setTimeout(onlongtouch, touchduration);
                    }
                }

                var touchend = function(e) {
                    e.preventDefault();                    
                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }
                }

                // clear on long touch
                var onlongtouch = function() { 
                    timer = null;
                    set_checklist(element, false);

                };
                // add listeners
                element.addEventListener("mousedown", touchstart, false);
                element.addEventListener("mouseup", touchend, false);
                element.addEventListener("touchstart", touchstart, false);
                element.addEventListener("touchend", touchend, false);
            }
                                                
            element.classList.add("swipe-uncheck");                        
            attach_listener(element);                        
        }                
    }