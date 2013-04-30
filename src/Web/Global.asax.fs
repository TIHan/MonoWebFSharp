
namespace MonoWeb

open System


type Global() = 
        inherit System.Web.HttpApplication()
        
        abstract Application_Start : Object * EventArgs -> unit
        default this.Application_Start(sender : Object, e : EventArgs) =
            let appHost = new AppHost()
            appHost.Init()
