//----------------------------------------------------------------------------------
//
// CRUNKCINI : objet INI
//
//----------------------------------------------------------------------------------
this.kcini=CRunkcini;

function CRunkcini()
{
    this.ini=null;
    this.iniFlags=0;
    this.iniName=null;
    this.iniCurrentGroup=null;
    this.iniCurrentItem=null;
    this.changeCounter=0;
}

CRunkcini.prototype=CServices.extend(new CRunExtension(),
{
    getNumberOfConditions:function()
    {
        return 0;
    },
    createRunObject:function(file, cob, version)
    {
        this.iniFlags = file.readAShort();
        this.iniName = this.parseName(file.readAString());
		if (this.iniName.length==0)
		{
			this.iniName="Ini.ini";
		}
        this.ini = new CIni();
        this.iniCurrentGroup = "Group";
        this.iniCurrentItem = "Item";
		this.changeCounter=0;
        return false;
    },
    handleRunObject:function()
    {
    	if (this.changeCounter>0)
    	{
    		this.changeCounter--;
    		if (this.changeCounter==0)
    		{
		        this.ini.saveIni();
    		}
    	}
    	return 0;
    },
    parseName:function(name)
    {
    	var pos=name.lastIndexOf("\\");
    	if (pos>0)
    	{
    		name=name.substring(pos+1);
    	}
        var n;
		for (n=0; n<name.length; n++)
		{
			if (name.charCodeAt(n)==32)
			{
				name=name.substring(0, n)+name.substring(n+1);
				n--;
			}	
		}				
    	return name;	    			
    },	    
    destroyRunObject:function(bFast)
    {
        this.ini.saveIni();
    },

    // Actions
    // -------------------------------------------------
    action:function(num, act)
    {
        switch (num)
        {
            case 0:
                this.SetCurrentGroup(act);
                break;
            case 1:
                this.SetCurrentItem(act);
                break;
            case 2:
                this.SetValue(act);
                break;
            case 3:
                this.SavePosition(act);
                break;
            case 4:
                this.LoadPosition(act);
                break;
            case 5:
                this.SetString(act);
                break;
            case 6:
                this.SetCurrentFile(act);
                break;
            case 7:
                this.SetValueItem(act);
                break;
            case 8:
                this.SetValueGroupItem(act);
                break;
            case 9:
                this.SetStringItem(act);
                break;
            case 10:
                this.SetStringGroupItem(act);
                break;
            case 11:
                this.DeleteItem(act);
                break;
            case 12:
                this.DeleteGroupItem(act);
                break;
            case 13:
                this.DeleteGroup(act);
                break;
        }
    },

    SetCurrentGroup:function(act)
    {
        this.iniCurrentGroup = act.getParamExpString(this.rh, 0);
    },

    SetCurrentItem:function(act)
    {
        this.iniCurrentItem = act.getParamExpString(this.rh, 0);
    },

    SetValue:function(act)
    {
        var value = act.getParamExpression(this.rh, 0);
        var s = value.toString();
        this.ini.writePrivateProfileString(this.iniCurrentGroup, this.iniCurrentItem, s, this.iniName);
        this.changeCounter=10;
    },

    SavePosition:function(act)
    {
        var hoPtr = act.getParamObject(this.rh, 0);
        var s = hoPtr.hoX.toString() + "," + hoPtr.hoY.toString();
        var item = "pos." + hoPtr.hoOiList.oilName;
        this.ini.writePrivateProfileString(this.iniCurrentGroup, item, s, this.iniName);
        this.changeCounter=10;
    },

    LoadPosition:function(act)
    {
        var hoPtr= act.getParamObject(this.rh, 0);
        var item = "pos." + hoPtr.hoOiList.oilName;
        var s = this.ini.getPrivateProfileString(this.iniCurrentGroup, item, "X", this.iniName);
        if (s!="X")
        {
            var virgule = s.indexOf(",");
            var left = s.substring(0, virgule);
            var right = s.substring(virgule + 1);
            hoPtr.hoX = parseInt(left, 10);
            if (isNaN(hoPtr.hoX))
            	hoPtr.hoX=0;
            hoPtr.hoY = parseInt(right, 10);
            if (isNaN(hoPtr.hoY))
            	hoPtr.hoY=0;
            hoPtr.roc.rcChanged = true;
            hoPtr.roc.rcCheckCollides = true;
        }
    },

    SetString:function(act)
    {
        var s = act.getParamExpString(this.rh, 0);
        this.ini.writePrivateProfileString(this.iniCurrentGroup, this.iniCurrentItem, s, this.iniName);
        this.changeCounter=10;
    },

    SetCurrentFile:function(act)
    {
        this.iniName = this.parseName(act.getParamExpString(this.rh, 0));
    },

    SetValueItem:function(act)
    {
        var item = act.getParamExpString(this.rh, 0);
        var value = act.getParamExpression(this.rh, 1);
        var s = value.toString();
        this.ini.writePrivateProfileString(this.iniCurrentGroup, item, s, this.iniName);
        this.changeCounter=10;
    },

    SetValueGroupItem:function(act)
    {
        var group = act.getParamExpString(this.rh, 0);
        var item = act.getParamExpString(this.rh, 1);
        var value = act.getParamExpression(this.rh, 2);
        var s = value.toString();
        this.ini.writePrivateProfileString(group, item, s, this.iniName);
        this.changeCounter=10;
    },

    SetStringItem:function(act)
    {
        var item = act.getParamExpString(this.rh, 0);
        var s = act.getParamExpString(this.rh, 1);
        this.ini.writePrivateProfileString(this.iniCurrentGroup, item, s, this.iniName);
        this.changeCounter=10;
    },

    SetStringGroupItem:function(act)
    {
        var group = act.getParamExpString(this.rh, 0);
        var item = act.getParamExpString(this.rh, 1);
        var s = act.getParamExpString(this.rh, 2);
        this.ini.writePrivateProfileString(group, item, s, this.iniName);
        this.changeCounter=10;
    },

    DeleteItem:function(act)
    {
        this.ini.deleteItem(this.iniCurrentGroup, act.getParamExpString(this.rh, 0), this.iniName);
        this.changeCounter=10;
    },

    DeleteGroupItem:function(act)
    {
        this.ini.deleteItem(act.getParamExpString(this.rh, 0), act.getParamExpString(this.rh, 1), this.iniName);
        this.changeCounter=10;
    },

    DeleteGroup:function(act)
    {
        this.ini.deleteGroup(act.getParamExpString(this.rh, 0), this.iniName);
        this.changeCounter=10;
    },

    // Expressions
    // --------------------------------------------
    expression:function(num)
    {
        switch (num)
        {
            case 0:
                return this.GetValue();
            case 1:
                return this.GetString();
            case 2:
                return this.GetValueItem();
            case 3:
                return this.GetValueGroupItem();
            case 4:
                return this.GetStringItem();
            case 5:
                return this.GetStringGroupItem();
        }
        return null;
    },

    GetValue:function()
    {
        var s = this.ini.getPrivateProfileString(this.iniCurrentGroup, this.iniCurrentItem, "", this.iniName);
        var value = 0;
        value = parseInt(s, 10);
        if (isNaN(value))
        	value=0;
        return (value);
    },

    GetString:function() 
    {
        return this.ini.getPrivateProfileString(this.iniCurrentGroup, this.iniCurrentItem, "", this.iniName);
    },

    GetValueItem:function()
    {
        var item = this.ho.getExpParam();
        var s = this.ini.getPrivateProfileString(this.iniCurrentGroup, item, "", this.iniName);
        var value = parseInt(s, 10);
        if (isNaN(value))
        	value=0;
        return (value);
    },

    GetValueGroupItem:function()
    {
        var group = this.ho.getExpParam();
        var item = this.ho.getExpParam();
        var s = this.ini.getPrivateProfileString(group, item, "", this.iniName);
        var value = parseInt(s, 10);;
        if (isNaN(value))
        	value=0;
        return (value);
    },

    GetStringItem:function()
    {
        var item = this.ho.getExpParam();
        return this.ini.getPrivateProfileString(this.iniCurrentGroup, item, "", this.iniName);
    },

    GetStringGroupItem:function()
    {
        var group = this.ho.getExpParam();
        var item = this.ho.getExpParam();
        return this.ini.getPrivateProfileString(group, item, "", this.iniName);
    }	
});


