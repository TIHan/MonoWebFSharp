
namespace MonoWeb

open System
open System.Web.UI
open System.Collections.Generic
open ServiceStack.Common
open ServiceStack.WebHost
open ServiceStack.ServiceHost
open ServiceStack.CacheAccess
open ServiceStack.CacheAccess.Providers
open ServiceStack.ServiceInterface
open ServiceStack.ServiceInterface.Auth
open ServiceStack.WebHost.Endpoints


type public AppHost() = 
    inherit AppHostBase("App", typedefof<AppHost>.Assembly)

    override this.Configure(container : Funq.Container) =
        ServiceStack.Text.JsConfig.EmitCamelCaseNames <- true
        
        this.SetConfig(new EndpointHostConfig(ServiceStackHandlerFactoryPath = "api", EnableFeatures = Feature.All.Remove(Feature.Metadata)))

        this.ConfigureAuth(container)

    member this.ConfigureAuth(container : Funq.Container) =
        let authProviders : IAuthProvider[] = [|new CredentialsAuthProvider()|]
        this.Plugins.Add(new AuthFeature(null, authProviders))

        container.Register<ICacheClient>(new MemoryCacheClient())
        let userRep = new InMemoryAuthRepository()
        container.Register<IUserAuthRepository>(userRep)

#if DEBUG
        this.CreateUser(userRep, 1, "admin", "admin@admin.com", "password", null, null)
#endif
        

    member this.CreateUser(userRep : IUserAuthRepository, id, userName, email, password, roles, permissions) =
        let mutable hash = ""
        let mutable salt = ""
        let saltedHash = new SaltedHash()
        saltedHash.GetHashAndSaltString(password, ref hash, ref salt)
        
        let userAuth = new UserAuth(Id = id, DisplayName = "DisplayName", Email = email, UserName = userName, FirstName = "FirstName", LastName = "LastName", PasswordHash = hash, Salt = salt, Roles = roles, Permissions = permissions)
        userRep.CreateUserAuth(userAuth, password) |> ignore
        