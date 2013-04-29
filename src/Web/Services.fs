
namespace MonoWeb

open System
open ServiceStack.Common.Web;
open ServiceStack.ServiceHost;
open ServiceStack.ServiceInterface;
open ServiceStack.Text;


[<Route("/auth/info")>]
type public AuthInfoRequest() = class end

[<Authenticate>]
type public AuthService() =
    inherit Service()
    
    member public this.Get(request : AuthInfoRequest) =
        this.GetSession()
        
[<Route("/test")>]
type public Test = class end

[<Route("/test/message")>]
[<Route("/test/message/{Message}")>]
type public TestMessage() =
    member val public Message : string = "" with get, set

[<Route("/testquery")>]
type public TestQuery() =
    member val public Field1 : string = "" with get, set
    member val public Field2 : string = "" with get, set
    member val public Field3 : string = "" with get, set
    
[<Route("/testlist")>]
type public TestList() = class end
    
    
type public TestResponse() =
    member val public Message : string = "" with get, set
    member val public Timestamp : DateTime = DateTime.UtcNow with get, set
    
[<Authenticate>]
type public AppService() =
    inherit Service()
    
    member public this.Get(request : Test) =
        new TestResponse(Message = "No Passed Message")
        
    member public this.Get(request : TestMessage) =
        new TestResponse(Message = request.Message)
        
    member public this.Get(request : TestQuery) =
        new TestResponse(Message = "Field1: " + request.Field1 + " - Field2: " + request.Field2 + " - Field3: " + request.Field3)
        
    member public this.Get(request : TestList) =
        [|new TestResponse(Message = "Item1"); new TestResponse(Message = "Item2"); new TestResponse(Message = "Item3")|]
        
    member public this.Post(request : Test) =
        new TestResponse(Message = "No Passed Message")
        
    member public this.Post(request : TestMessage) =
        new TestResponse(Message = request.Message)
        
    member public this.Put(request : Test) =
        new TestResponse(Message = "No Passed Message")
        
    member public this.Put(request : TestMessage) =
        new TestResponse(Message = request.Message)
        
    member public this.Delete(request : Test) =
        new TestResponse(Message = "No Passed Message")
        
    member public this.Delete(request : TestMessage) =
        new TestResponse(Message = request.Message)

    
