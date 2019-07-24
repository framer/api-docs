export default {
  "(myclass:class)": {
    "children": {
      "(mymethod:instance,1)": {
        "children": {
          "(param1:parameter)": {
            "children": {},
            "model": {
              "id": "(myclass:class).(mymethod:instance,1).(param1:parameter)",
              "parentId": "(myclass:class).(mymethod:instance,1)",
              "name": "param1",
              "fullname": "MyClass.myMethod().param1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "myMethod(param1: string): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "string"
            }
          }
        },
        "model": {
          "id": "(myclass:class).(mymethod:instance,1)",
          "parentId": "(myclass:class)",
          "name": "myMethod",
          "fullname": "MyClass.myMethod()",
          "kind": "Method",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "myMethod(param1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 1,
          "overloads": [
            "(myclass:class).(mymethod:instance,2)"
          ],
          "parameters": [
            "(myclass:class).(mymethod:instance,1).(param1:parameter)"
          ]
        }
      },
      "(mymethod:instance,2)": {
        "children": {
          "(overload1:parameter)": {
            "children": {},
            "model": {
              "id": "(myclass:class).(mymethod:instance,2).(overload1:parameter)",
              "parentId": "(myclass:class).(mymethod:instance,2)",
              "name": "overload1",
              "fullname": "MyClass.myMethod().overload1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "myMethod(overload1: number): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "number"
            }
          }
        },
        "model": {
          "id": "(myclass:class).(mymethod:instance,2)",
          "parentId": "(myclass:class)",
          "name": "myMethod",
          "fullname": "MyClass.myMethod()",
          "kind": "Method",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "myMethod(overload1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 2,
          "overloads": [
            "(myclass:class).(mymethod:instance,1)"
          ],
          "parameters": [
            "(myclass:class).(mymethod:instance,2).(overload1:parameter)"
          ]
        }
      },
      "(myproperty:instance)": {
        "children": {},
        "model": {
          "id": "(myclass:class).(myproperty:instance)",
          "parentId": "(myclass:class)",
          "name": "myProperty",
          "fullname": "MyClass.myProperty",
          "kind": "Property",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "myProperty: string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      },
      "(mystaticmethod:static,1)": {
        "children": {
          "(param1:parameter)": {
            "children": {},
            "model": {
              "id": "(myclass:class).(mystaticmethod:static,1).(param1:parameter)",
              "parentId": "(myclass:class).(mystaticmethod:static,1)",
              "name": "param1",
              "fullname": "MyClass.myStaticMethod().param1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "static myStaticMethod(param1: string): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "string"
            }
          }
        },
        "model": {
          "id": "(myclass:class).(mystaticmethod:static,1)",
          "parentId": "(myclass:class)",
          "name": "myStaticMethod",
          "fullname": "MyClass.myStaticMethod()",
          "kind": "Method",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "static myStaticMethod(param1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": true,
          "overloadIndex": 1,
          "overloads": [
            "(myclass:class).(mystaticmethod:static,2)"
          ],
          "parameters": [
            "(myclass:class).(mystaticmethod:static,1).(param1:parameter)"
          ]
        }
      },
      "(mystaticmethod:static,2)": {
        "children": {
          "(overloaded1:parameter)": {
            "children": {},
            "model": {
              "id": "(myclass:class).(mystaticmethod:static,2).(overloaded1:parameter)",
              "parentId": "(myclass:class).(mystaticmethod:static,2)",
              "name": "overloaded1",
              "fullname": "MyClass.myStaticMethod().overloaded1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "static myStaticMethod(overloaded1: number): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "number"
            }
          }
        },
        "model": {
          "id": "(myclass:class).(mystaticmethod:static,2)",
          "parentId": "(myclass:class)",
          "name": "myStaticMethod",
          "fullname": "MyClass.myStaticMethod()",
          "kind": "Method",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "static myStaticMethod(overloaded1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": true,
          "overloadIndex": 2,
          "overloads": [
            "(myclass:class).(mystaticmethod:static,1)"
          ],
          "parameters": [
            "(myclass:class).(mystaticmethod:static,2).(overloaded1:parameter)"
          ]
        }
      },
      "(mystaticproperty:static)": {
        "children": {},
        "model": {
          "id": "(myclass:class).(mystaticproperty:static)",
          "parentId": "(myclass:class)",
          "name": "myStaticProperty",
          "fullname": "MyClass.myStaticProperty",
          "kind": "Property",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "static myStaticProperty: string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      }
    },
    "model": {
      "id": "(myclass:class)",
      "parentId": "",
      "name": "MyClass",
      "fullname": "MyClass",
      "kind": "Class",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare class MyClass ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "constructor": "(myclass:constructor)",
      "properties": [
        "(myclass:class).(myproperty:instance)",
        "(myclass:class).(mystaticproperty:static)"
      ],
      "methods": []
    }
  },
  "(myclass:constructor)": {
    "children": {
      "(param1:parameter)": {
        "children": {},
        "model": {
          "id": "(myclass:constructor).(param1:parameter)",
          "parentId": "(myclass:constructor)",
          "name": "param1",
          "fullname": "MyClass.(constructor).param1",
          "kind": "Parameter",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "constructor(param1: string);",
          "tsdoc": "/**\n * Constructs a new instance of the `MyClass` class\n *\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      }
    },
    "model": {
      "id": "(myclass:constructor)",
      "parentId": "(myclass:class)",
      "name": "MyClass",
      "fullname": "MyClass.(constructor)",
      "kind": "Constructor",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "MyClass(param1)",
      "tsdoc": "/**\n * Constructs a new instance of the `MyClass` class\n *\n * @public\n */\n",
      "summaryMarkup": "<p>Constructs a new instance of the <code class=\"DocCodeSpan\">MyClass</code> class</p>",
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "returnType": "void",
      "returnMarkup": null,
      "overloadIndex": 0,
      "overloads": [],
      "parameters": [
        "(myclass:constructor).(param1:parameter)"
      ]
    }
  },
  "(myenum:enum)": {
    "children": {
      "myfield1": {
        "children": {},
        "model": {
          "id": "(myenum:enum).myfield1",
          "parentId": "(myenum:enum)",
          "name": "MyField1",
          "fullname": "MyEnum.MyField1",
          "kind": "EnumMember",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyField1",
          "summaryMarkup": null,
          "tsdoc": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": ""
        }
      },
      "myfield2": {
        "children": {},
        "model": {
          "id": "(myenum:enum).myfield2",
          "parentId": "(myenum:enum)",
          "name": "MyField2",
          "fullname": "MyEnum.MyField2",
          "kind": "EnumMember",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyField2",
          "summaryMarkup": null,
          "tsdoc": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": ""
        }
      },
      "myfield3": {
        "children": {},
        "model": {
          "id": "(myenum:enum).myfield3",
          "parentId": "(myenum:enum)",
          "name": "MyField3",
          "fullname": "MyEnum.MyField3",
          "kind": "EnumMember",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyField3",
          "summaryMarkup": null,
          "tsdoc": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": ""
        }
      }
    },
    "model": {
      "id": "(myenum:enum)",
      "parentId": "",
      "name": "MyEnum",
      "fullname": "MyEnum",
      "kind": "Enum",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare enum MyEnum ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "fields": [
        "(myenum:enum).myfield1",
        "(myenum:enum).myfield2",
        "(myenum:enum).myfield3"
      ]
    }
  },
  "(myextendedenum:enum)": {
    "children": {
      "myextendedenumfield": {
        "children": {},
        "model": {
          "id": "(myextendedenum:enum).myextendedenumfield",
          "parentId": "(myextendedenum:enum)",
          "name": "MyExtendedEnumField",
          "fullname": "MyExtendedEnum.MyExtendedEnumField",
          "kind": "EnumMember",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyExtendedEnumField",
          "summaryMarkup": null,
          "tsdoc": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": ""
        }
      }
    },
    "model": {
      "id": "(myextendedenum:enum)",
      "parentId": "",
      "name": "MyExtendedEnum",
      "fullname": "MyExtendedEnum",
      "kind": "Enum",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare enum MyExtendedEnum ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "fields": [
        "(myextendedenum:enum).myextendedenumfield"
      ]
    }
  },
  "(myextendedenum:namespace)": {
    "children": {
      "(myextendedenummethod:function)": {
        "children": {},
        "model": {
          "id": "(myextendedenum:namespace).(myextendedenummethod:function)",
          "parentId": "(myextendedenum:namespace)",
          "name": "myExtendedEnumMethod",
          "fullname": "MyExtendedEnum.myExtendedEnumMethod()",
          "kind": "Function",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyExtendedEnum.myExtendedEnumMethod(): string",
          "summaryMarkup": null,
          "tsdoc": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 0,
          "overloads": [],
          "parameters": []
        }
      }
    },
    "model": {
      "id": "(myextendedenum:namespace)",
      "parentId": "",
      "name": "MyExtendedEnum",
      "fullname": "MyExtendedEnum",
      "kind": "Namespace",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare namespace MyExtendedEnum ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "members": [
        "(myextendedenum:namespace).(myextendedenummethod:function)"
      ]
    }
  },
  "(myfunction:1)": {
    "children": {
      "(param1:parameter)": {
        "children": {},
        "model": {
          "id": "(myfunction:1).(param1:parameter)",
          "parentId": "(myfunction:1)",
          "name": "param1",
          "fullname": "myFunction().param1",
          "kind": "Parameter",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "export declare function myFunction(param1: string): string;",
          "tsdoc": "/**\n * This is a simple public function.\n *\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      }
    },
    "model": {
      "id": "(myfunction:1)",
      "parentId": "",
      "name": "myFunction",
      "fullname": "myFunction()",
      "kind": "Function",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "myFunction(param1): string",
      "tsdoc": "/**\n * This is a simple public function.\n *\n * @public\n */\n",
      "summaryMarkup": "<p>This is a simple public function.</p>",
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "returnType": "string",
      "returnMarkup": null,
      "isStatic": false,
      "overloadIndex": 1,
      "overloads": [],
      "parameters": [
        "(myfunction:1).(param1:parameter)"
      ]
    }
  },
  "(myfunction:2)": {
    "children": {
      "(overloaded1:parameter)": {
        "children": {},
        "model": {
          "id": "(myfunction:2).(overloaded1:parameter)",
          "parentId": "(myfunction:2)",
          "name": "overloaded1",
          "fullname": "myFunction().overloaded1",
          "kind": "Parameter",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "export declare function myFunction(overloaded1: number): string;",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "number"
        }
      }
    },
    "model": {
      "id": "(myfunction:2)",
      "parentId": "",
      "name": "myFunction",
      "fullname": "myFunction()",
      "kind": "Function",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "myFunction(overloaded1): string",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "returnType": "string",
      "returnMarkup": null,
      "isStatic": false,
      "overloadIndex": 2,
      "overloads": [],
      "parameters": [
        "(myfunction:2).(overloaded1:parameter)"
      ]
    }
  },
  "(myfunctionwithnamespace:1)": {
    "children": {
      "(param1:parameter)": {
        "children": {},
        "model": {
          "id": "(myfunctionwithnamespace:1).(param1:parameter)",
          "parentId": "(myfunctionwithnamespace:1)",
          "name": "param1",
          "fullname": "MyFunctionWithNamespace().param1",
          "kind": "Parameter",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "export declare function MyFunctionWithNamespace(param1: string): string;",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": null,
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      }
    },
    "model": {
      "id": "(myfunctionwithnamespace:1)",
      "parentId": "",
      "name": "MyFunctionWithNamespace",
      "fullname": "MyFunctionWithNamespace()",
      "kind": "Function",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "MyFunctionWithNamespace(param1): string",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "returnType": "string",
      "returnMarkup": null,
      "isStatic": false,
      "overloadIndex": 1,
      "overloads": [],
      "parameters": [
        "(myfunctionwithnamespace:1).(param1:parameter)"
      ]
    }
  },
  "(myfunctionwithnamespace:namespace)": {
    "children": {
      "(myfunctionwithnamespacefunction:function)": {
        "children": {
          "(param1:parameter)": {
            "children": {},
            "model": {
              "id": "(myfunctionwithnamespace:namespace).(myfunctionwithnamespacefunction:function).(param1:parameter)",
              "parentId": "(myfunctionwithnamespace:namespace).(myfunctionwithnamespacefunction:function)",
              "name": "param1",
              "fullname": "MyFunctionWithNamespace.myFunctionWithNamespaceFunction().param1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "export function myFunctionWithNamespaceFunction(param1: string): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "string"
            }
          }
        },
        "model": {
          "id": "(myfunctionwithnamespace:namespace).(myfunctionwithnamespacefunction:function)",
          "parentId": "(myfunctionwithnamespace:namespace)",
          "name": "myFunctionWithNamespaceFunction",
          "fullname": "MyFunctionWithNamespace.myFunctionWithNamespaceFunction()",
          "kind": "Function",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyFunctionWithNamespace.myFunctionWithNamespaceFunction(param1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 0,
          "overloads": [],
          "parameters": [
            "(myfunctionwithnamespace:namespace).(myfunctionwithnamespacefunction:function).(param1:parameter)"
          ]
        }
      }
    },
    "model": {
      "id": "(myfunctionwithnamespace:namespace)",
      "parentId": "",
      "name": "MyFunctionWithNamespace",
      "fullname": "MyFunctionWithNamespace",
      "kind": "Namespace",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare namespace MyFunctionWithNamespace ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "members": [
        "(myfunctionwithnamespace:namespace).(myfunctionwithnamespacefunction:function)"
      ]
    }
  },
  "(myinterface:interface)": {
    "children": {
      "(:new,0)": {
        "children": {
          "(param1:parameter)": {
            "children": {},
            "model": {
              "id": "(myinterface:interface).(:new,0).(param1:parameter)",
              "parentId": "(myinterface:interface).(:new,0)",
              "name": "param1",
              "fullname": "MyInterface.(new).param1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "new (param1: string): MyInterface;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "string"
            }
          }
        },
        "model": {
          "id": "(myinterface:interface).(:new,0)",
          "parentId": "(myinterface:interface)",
          "name": "MyInterface",
          "fullname": "MyInterface.(new)",
          "kind": "ConstructSignature",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyInterface(param1)",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "MyInterface",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 0,
          "overloads": [],
          "parameters": [
            "(myinterface:interface).(:new,0).(param1:parameter)"
          ]
        }
      },
      "(mymethodsignature:0)": {
        "children": {
          "(param1:parameter)": {
            "children": {},
            "model": {
              "id": "(myinterface:interface).(mymethodsignature:0).(param1:parameter)",
              "parentId": "(myinterface:interface).(mymethodsignature:0)",
              "name": "param1",
              "fullname": "MyInterface.myMethodSignature().param1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "myMethodSignature(param1: string): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "string"
            }
          }
        },
        "model": {
          "id": "(myinterface:interface).(mymethodsignature:0)",
          "parentId": "(myinterface:interface)",
          "name": "myMethodSignature",
          "fullname": "MyInterface.myMethodSignature()",
          "kind": "MethodSignature",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "myMethodSignature(param1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 0,
          "overloads": [],
          "parameters": [
            "(myinterface:interface).(mymethodsignature:0).(param1:parameter)"
          ]
        }
      },
      "mypropertysignature": {
        "children": {},
        "model": {
          "id": "(myinterface:interface).mypropertysignature",
          "parentId": "(myinterface:interface)",
          "name": "myPropertySignature",
          "fullname": "MyInterface.myPropertySignature",
          "kind": "PropertySignature",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "myPropertySignature: string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      }
    },
    "model": {
      "id": "(myinterface:interface)",
      "parentId": "",
      "name": "MyInterface",
      "fullname": "MyInterface",
      "kind": "Interface",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare interface MyInterface ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "constructor": "(myinterface:interface).(:new,0)",
      "properties": [
        "(myinterface:interface).mypropertysignature"
      ],
      "methods": [
        "(myinterface:interface).(mymethodsignature:0)"
      ]
    }
  },
  "(mynamespace:namespace)": {
    "children": {
      "(mynamespacefunction:function)": {
        "children": {
          "(param1:parameter)": {
            "children": {},
            "model": {
              "id": "(mynamespace:namespace).(mynamespacefunction:function).(param1:parameter)",
              "parentId": "(mynamespace:namespace).(mynamespacefunction:function)",
              "name": "param1",
              "fullname": "MyNamespace.myNamespaceFunction().param1",
              "kind": "Parameter",
              "releaseTag": "public",
              "visibility": "public",
              "signature": "export function myNamespaceFunction(param1: string): string;",
              "tsdoc": "/**\n * @public\n */\n",
              "summaryMarkup": null,
              "remarksMarkup": null,
              "prototypeMarkup": null,
              "productionMarkup": null,
              "deprecatedMarkup": null,
              "type": "string"
            }
          }
        },
        "model": {
          "id": "(mynamespace:namespace).(mynamespacefunction:function)",
          "parentId": "(mynamespace:namespace)",
          "name": "myNamespaceFunction",
          "fullname": "MyNamespace.myNamespaceFunction()",
          "kind": "Function",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "MyNamespace.myNamespaceFunction(param1): string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "returnType": "string",
          "returnMarkup": null,
          "isStatic": false,
          "overloadIndex": 0,
          "overloads": [],
          "parameters": [
            "(mynamespace:namespace).(mynamespacefunction:function).(param1:parameter)"
          ]
        }
      },
      "(mynamespaceinterface:interface)": {
        "children": {},
        "model": {
          "id": "(mynamespace:namespace).(mynamespaceinterface:interface)",
          "parentId": "(mynamespace:namespace)",
          "name": "MyNamespaceInterface",
          "fullname": "MyNamespace.MyNamespaceInterface",
          "kind": "Interface",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "export interface MyNamespaceInterface ",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "constructor": null,
          "properties": [],
          "methods": []
        }
      },
      "mynamespacetype": {
        "children": {},
        "model": {
          "id": "(mynamespace:namespace).mynamespacetype",
          "parentId": "(mynamespace:namespace)",
          "name": "myNamespaceType",
          "fullname": "MyNamespace.myNamespaceType",
          "kind": "TypeAlias",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "export type myNamespaceType = string;",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null
        }
      },
      "(mynamespacevariable:variable)": {
        "children": {},
        "model": {
          "id": "(mynamespace:namespace).(mynamespacevariable:variable)",
          "parentId": "(mynamespace:namespace)",
          "name": "myNamespaceVariable",
          "fullname": "MyNamespace.myNamespaceVariable",
          "kind": "Variable",
          "releaseTag": "public",
          "visibility": "public",
          "signature": "myNamespaceVariable: string",
          "tsdoc": "/**\n * @public\n */\n",
          "summaryMarkup": null,
          "remarksMarkup": "",
          "prototypeMarkup": null,
          "productionMarkup": null,
          "deprecatedMarkup": null,
          "type": "string"
        }
      }
    },
    "model": {
      "id": "(mynamespace:namespace)",
      "parentId": "",
      "name": "MyNamespace",
      "fullname": "MyNamespace",
      "kind": "Namespace",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare namespace MyNamespace ",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "members": [
        "(mynamespace:namespace).(mynamespacefunction:function)",
        "(mynamespace:namespace).(mynamespaceinterface:interface)",
        "(mynamespace:namespace).mynamespacetype",
        "(mynamespace:namespace).(mynamespacevariable:variable)"
      ]
    }
  },
  "(my_variable:variable)": {
    "children": {},
    "model": {
      "id": "(my_variable:variable)",
      "parentId": "",
      "name": "MY_VARIABLE",
      "fullname": "MY_VARIABLE",
      "kind": "Variable",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "MY_VARIABLE: string",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null,
      "type": "string"
    }
  },
  "mytype": {
    "children": {},
    "model": {
      "id": "mytype",
      "parentId": "",
      "name": "MyType",
      "fullname": "MyType",
      "kind": "TypeAlias",
      "releaseTag": "public",
      "visibility": "public",
      "signature": "export declare type MyType = string;",
      "tsdoc": "/**\n * @public\n */\n",
      "summaryMarkup": null,
      "remarksMarkup": "",
      "prototypeMarkup": null,
      "productionMarkup": null,
      "deprecatedMarkup": null
    }
  }
}
